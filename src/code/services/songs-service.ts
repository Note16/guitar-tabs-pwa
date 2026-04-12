import { Song } from "../../types.js";
import { initDB, loadSongs, saveSong, deleteSong } from "../adapters/db";
import sampleSongs from "../../data/sampleSongs.json";

const STORAGE_KEY = "guitar-tabs-last-selected-song";
const _songs: Song[] = [];
let _searchQuery: string = "";

export async function getSongs(): Promise<Song[]> {
  if (_searchQuery !== "") {
    return _songs.filter(
      (song) =>
        song.title.toLowerCase().includes(_searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(_searchQuery.toLowerCase()),
    );
  }

  if (_songs.length > 0) {
    return _songs;
  }

  await initDB();
  _songs.push(...(await loadSongs()));

  if (_songs.length === 0) {
    _songs.push(...sampleSongs);
    await Promise.all(_songs.map((song) => saveSong(song)));
  }

  return _songs;
}

export function getSongById(id: string): Song | undefined {
  return _songs.find((song) => song.id === id);
}

export function getLastSelectedSong(): Song | undefined {
  const songId = localStorage.getItem(STORAGE_KEY);
  return songId ? getSongById(songId) : undefined;
}

export function setLastSelectedSong(songId: string | null): void {
  if (songId) {
    localStorage.setItem(STORAGE_KEY, songId);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function setSearchQuery(query: string): void {
  _searchQuery = query;
}

export async function updateSong(song: Song): Promise<void> {
  await saveSong(song);
  const index = _songs.findIndex((s) => s.id === song.id);
  if (index !== -1) {
    _songs[index] = song;
  }
}

export async function removeSong(id: string): Promise<void> {
  await deleteSong(id);
  const index = _songs.findIndex((s) => s.id === id);
  if (index !== -1) {
    _songs.splice(index, 1);
  }
}

export async function addSong(song: Song): Promise<void> {
  if (_songs.some((s) => s.id === song.id)) {
    alert("A song with this title already exists");
    return;
  }
  await saveSong(song);
  _songs.push(song);
}
