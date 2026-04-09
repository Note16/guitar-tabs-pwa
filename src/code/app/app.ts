import { Song, SongFormData } from "../../types.js";
import { initDB, loadSongs, saveSong, deleteSong } from "../adapters/db.js";
import { parseChordPro } from "../parses/chord-pro.js";
import { initPWA } from "../components/pwa.js";
import sampleSongs from "../../data/sampleSongs.json";

import {
  updateFiltered,
  renderSongList,
  selectSong,
} from "../components/song-list.js";
import { initSearch, getSearchQuery } from "../components/song-search.js";
import { initModal, showModal, hideModal } from "../components/song-model.js";
import {
  getLastSelectedSong,
  saveLastSelectedSong,
} from "../services/selection-storage.js";
import { initOfflineIndicator } from "../components/offline-indicator.js";

let songs: Song[] = [];
let filteredSongs: Song[] = [];
let activeSongId: string | null = null;
let isEditing = false;
let currentEditId: string | null = null;

const addBtn = document.getElementById("btn-add") as HTMLButtonElement;
const songListPanel = document.querySelector(".song-list-panel") as HTMLElement;
const songViewPanel = document.querySelector(".song-view-panel") as HTMLElement;
const backBtn = document.getElementById("btn-back") as HTMLButtonElement;

function togglePanel(): void {
  songListPanel.classList.toggle("hidden");
  songViewPanel.classList.toggle("hidden");
}

function handlePopState(event: PopStateEvent): void {
  if (event.state && event.state.isSongView === false) {
    togglePanel();
  }
}

async function initApp(): Promise<void> {
  try {
    await initDB();
    songs = await loadSongs();

    if (songs.length === 0) {
      songs = [...sampleSongs];
      await Promise.all(songs.map((song) => saveSong(song)));
    }

    const storedSongId = getLastSelectedSong();
    const persistedSong = storedSongId
      ? songs.find((song) => song.id === storedSongId)
      : null;

    if (persistedSong) {
      activeSongId = persistedSong.id;
      togglePanel();
      selectSong(persistedSong.id, songs);
      history.replaceState({ isSongView: true }, "");
    } else {
      saveLastSelectedSong(null);
      history.replaceState({ isSongView: false }, "");
    }

    filteredSongs = updateFiltered(songs, "");
    renderSongList(filteredSongs, handleSongSelect, handleEdit, handleDelete);

    addBtn.addEventListener("click", () => {
      showModal(false);
    });

    backBtn?.addEventListener("click", () => {
      localStorage.removeItem("guitar-tabs-last-selected-song");
      togglePanel();
      history.replaceState({ isSongView: false }, "");
    });

    window.addEventListener("popstate", handlePopState);

    initSearch(handleSearch);
    initModal(handleFormSubmit, handleCancel);
    initOfflineIndicator();
    initPWA();
  } catch (error) {
    console.error("Failed to initialize app:", error);
  }
}

function handleSearch(query: string): void {
  filteredSongs = updateFiltered(songs, query);
  renderSongList(filteredSongs, handleSongSelect, handleEdit, handleDelete);
}

function handleSongSelect(songId: string): void {
  activeSongId = songId;
  togglePanel();
  saveLastSelectedSong(songId);
  selectSong(songId, songs);
  history.pushState({ isSongView: true }, "", `#song-${songId}`);
  renderSongList(filteredSongs, handleSongSelect, handleEdit, handleDelete);
}

function handleEdit(songId: string): void {
  const song = songs.find((s) => s.id === songId);
  if (song) {
    isEditing = true;
    currentEditId = songId;
    showModal(true, song);
  }
}

async function handleDelete(songId: string): Promise<void> {
  if (confirm("Delete this song?")) {
    try {
      await deleteSong(songId);
      songs = songs.filter((s) => s.id !== songId);
      filteredSongs = updateFiltered(songs, getSearchQuery());
      renderSongList(filteredSongs, handleSongSelect, handleEdit, handleDelete);

      if (songId === activeSongId) {
        saveLastSelectedSong(null);
        history.replaceState({ isSongView: false }, "");
      }
    } catch (error) {
      console.error("Failed to delete song:", error);
    }
  }
}

async function handleFormSubmit(data: SongFormData): Promise<void> {
  try {
    const content = parseChordPro(data.content);
    if (content.length === 0) {
      alert("Invalid content format. Use [chord]text format.");
      return;
    }

    if (isEditing && currentEditId) {
      const song = songs.find((s) => s.id === currentEditId);
      if (song) {
        song.title = data.title;
        song.artist = data.artist;
        song.content = content;
        await saveSong(song);
        if (activeSongId === currentEditId) {
          selectSong(currentEditId, songs);
        }
      }
    } else {
      const id = data.title.toLowerCase().replace(/\s+/g, "-");
      if (songs.some((s) => s.id === id)) {
        alert("A song with this title already exists");
        return;
      }
      const newSong: Song = {
        id,
        title: data.title,
        artist: data.artist,
        content,
      };
      songs.push(newSong);
      await saveSong(newSong);
    }

    filteredSongs = updateFiltered(songs, getSearchQuery());
    renderSongList(filteredSongs, handleSongSelect, handleEdit, handleDelete);
    hideModal();
    resetFormState();
  } catch (error) {
    console.error("Failed to save song:", error);
  }
}

function handleCancel(): void {
  resetFormState();
}

function resetFormState(): void {
  isEditing = false;
  currentEditId = null;
}

export { initApp };
