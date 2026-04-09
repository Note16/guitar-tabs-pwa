import { Song } from "../../types.js";
import { renderSong } from "./song.js";

const songList = document.getElementById("songList") as HTMLDivElement;

export function updateFiltered(songs: Song[], query: string): Song[] {
  return songs.filter(
    (song) =>
      song.title.toLowerCase().includes(query.toLowerCase()) ||
      song.artist.toLowerCase().includes(query.toLowerCase()),
  );
}

export function renderSongList(
  songs: Song[],
  onSelect: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): void {
  songList.innerHTML = songs
    .map((song) => {
      return `
      <div class="song-card" data-id="${song.id}">
        <div>
          <h3>${song.title}</h3>
          <p>${song.artist}</p>
        </div>
        <div class="song-actions">
          <button class="edit-btn" data-id="${song.id}">Edit</button>
          <button class="delete-btn" data-id="${song.id}">Delete</button>
        </div>
      </div>
    `;
    })
    .join("");

  // Add event listeners
  document.querySelectorAll(".song-card").forEach((button) => {
    button.addEventListener("click", (e) => {
      if (
        !(e.target as HTMLElement).classList.contains("edit-btn") &&
        !(e.target as HTMLElement).classList.contains("delete-btn")
      ) {
        const songId = (button as HTMLButtonElement).dataset.id!;
        onSelect(songId);
      }
    });
  });

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = (btn as HTMLButtonElement).dataset.id!;
      onEdit(id);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = (btn as HTMLButtonElement).dataset.id!;
      onDelete(id);
    });
  });
}

export function selectSong(songId: string, songs: Song[]): Song | null {
  const song = songs.find((item) => item.id === songId);
  if (song) {
    renderSong(song);
  }
  return song || null;
}
