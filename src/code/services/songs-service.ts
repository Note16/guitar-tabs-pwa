import { AddSongRequest, Song } from "../../types.js";
import {
  initIndexedDB,
  deleteSong as idbDeletesong,
  saveSong as idbSaveSong,
  loadSongs as idbGetSong,
} from "../repositories/indexed-db.js";
import {
  deleteSong as apiDeleteSong,
  updateSong as apiUpdateSong,
  getSongs as apiGetSongs,
  createSong as postApiSong,
} from "../repositories/songs-api.js";
import { isOffline } from "../components/offline-indicator.js";

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

  await initIndexedDB();
  const offlineSongs = await idbGetSong();
  if (isOffline()) {
    _songs.push(...offlineSongs);
  } else {
    const onlineSongs = await apiGetSongs();
    _songs.push(...onlineSongs);

    if (offlineSongs != onlineSongs) {
      offlineSongs.every((song) => idbDeletesong(song.id));
      onlineSongs.every((song) => idbSaveSong(song));
    }
  }
  return _songs;
}

export function getSongById(id: string): Song | undefined {
  return _songs.find((song) => song.id === id);
}

export function setSearchQuery(query: string): void {
  _searchQuery = query;
}

export async function updateSong(song: Song): Promise<void> {
  if (!isOffline()) {
    await apiUpdateSong({
      id: song.id,
      artist: song.artist,
      title: song.title,
      content: song.content,
    });
  }

  await idbSaveSong(song);
  const index = _songs.findIndex((s) => s.id === song.id);
  if (index !== -1) {
    _songs[index] = song;
  }
}

export async function removeSong(id: string): Promise<void> {
  if (!isOffline()) {
    await apiDeleteSong(id);
  }

  await idbDeletesong(id);
  const index = _songs.findIndex((s) => s.id === id);
  if (index !== -1) {
    _songs.splice(index, 1);
  }
}

export async function addSong(song: AddSongRequest): Promise<void> {
  let id = Date.now().toString();
  if (!isOffline()) {
    const response = await postApiSong({
      title: song.title,
      artist: song.artist,
      content: song.content,
    });
    id = response?.id!;
  }

  const newSong = { id, ...song };
  await idbSaveSong(newSong);
  _songs.push(newSong);
}
