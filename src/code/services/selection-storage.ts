const STORAGE_KEY = "guitar-tabs-last-selected-song";

export function saveLastSelectedSong(songId: string | null): void {
  if (songId) {
    localStorage.setItem(STORAGE_KEY, songId);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function getLastSelectedSong(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}
