import {
  getSongById,
  getSongs,
  removeSong,
  setLastSelectedSong,
} from "../services/songs-service.js";
import { togglePanels } from "./panels.js";
import { showModal } from "./song-model.js";
import { renderSong } from "./song.js";

const songList = document.getElementById("songList") as HTMLDivElement;

export async function renderSongList(): Promise<void> {
  const songs = await getSongs();
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

  document.querySelectorAll(".song-card").forEach((button) => {
    button.addEventListener("click", (e) => {
      if (
        !(e.target as HTMLElement).classList.contains("edit-btn") &&
        !(e.target as HTMLElement).classList.contains("delete-btn")
      ) {
        const songId = (button as HTMLButtonElement).dataset.id!;
        const song = getSongById(songId);
        if (!song) {
          alert("Song not found");
          return;
        }

        togglePanels();
        setLastSelectedSong(songId);
        renderSong(song);
        history.pushState({ isSongView: true }, "", `#song-${songId}`);
        renderSongList();
      }
    });
  });

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const songId = (btn as HTMLButtonElement).dataset.id!;
      const song = getSongById(songId);
      showModal(true, song);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const songId = (btn as HTMLButtonElement).dataset.id!;

      if (confirm("Delete this song?")) {
        try {
          await removeSong(songId);
          renderSongList();
        } catch (error) {
          console.error("Failed to delete song:", error);
        }
      }
    });
  });
}
