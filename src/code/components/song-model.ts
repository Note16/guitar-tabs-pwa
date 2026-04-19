import { AddSongRequest, Song, SongFormData } from "../../types.js";
import { parseChordPro, songToChordPro } from "../parses/chord-pro.js";
import { convertTabbedContent, isTabbedContent } from "../parses/convert.js";
import { addSong, getSongById, updateSong } from "../services/songs-service.js";
import { renderSongList } from "./song-list.js";
import { renderSong } from "./song.js";

const modal = document.getElementById("song-modal") as HTMLDivElement;
const form = document.getElementById("song-form") as HTMLFormElement;
const cancelBtn = document.getElementById("btn-cancel") as HTMLButtonElement;
const submitBtn = form.querySelector(
  'button[type="submit"]',
) as HTMLButtonElement;

let currentEditId: string | null = null;

export function initModal(): void {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = (
      document.getElementById("song-title") as HTMLInputElement
    ).value.trim();
    const artist = (
      document.getElementById("song-artist") as HTMLInputElement
    ).value.trim();
    const content = (
      document.getElementById("song-content-input") as HTMLTextAreaElement
    ).value.trim();

    if (!title || !artist || !content) {
      alert("Please fill all fields");
      return;
    }

    FormSubmit({ title, artist, content });
  });

  cancelBtn.addEventListener("click", () => {
    if (document.referrer.indexOf(location.host) > 0) history.back();
    else hideModal();
  });
}

export function showModal(isEditing: boolean, song?: Song): void {
  currentEditId = song ? song.id : null;
  submitBtn.textContent = isEditing ? "Update Song" : "Add Song";
  modal.classList.remove("hidden");

  if (song) {
    (document.getElementById("song-title") as HTMLInputElement).value =
      song.title;
    (document.getElementById("song-artist") as HTMLInputElement).value =
      song.artist;
    (
      document.getElementById("song-content-input") as HTMLTextAreaElement
    ).value = song.content;

    history.pushState({ action: "edit-modal" }, "", `#${song.id}*edit`);
  } else {
    form.reset();
    history.pushState({ action: "show-modal" }, "", "");
  }
}

async function FormSubmit(data: SongFormData): Promise<void> {
  try {
    if (isTabbedContent(data.content)) {
      data.content = convertTabbedContent(data.content);
    }

    const content = songToChordPro(parseChordPro(data.content));
    if (content.length === 0) {
      alert("Invalid content format. Use [chord]text format.");
      return;
    }

    if (currentEditId) {
      const song = getSongById(currentEditId);
      if (song) {
        song.title = data.title;
        song.artist = data.artist;
        song.content = content;
        await updateSong(song);
        renderSong(song);
      }
    } else {
      const newSong: AddSongRequest = {
        title: data.title,
        artist: data.artist,
        content,
      };
      await addSong(newSong);
    }

    renderSongList();
    hideModal();
  } catch (error) {
    console.error("Failed to save song:", error);
  }
}

export function hideModal(): void {
  currentEditId = null;
  modal.classList.add("hidden");
  form.reset();
}
