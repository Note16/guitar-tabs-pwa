import {
  getSongById,
  getSongs,
  removeSong,
} from "../services/songs-service.js";
import { togglePanels } from "./panels.js";
import { showModal } from "./song-model.js";
import { renderSong } from "./song.js";

const songList = document.getElementById("songList") as HTMLDivElement;

export async function renderSongList(editable?: boolean): Promise<void> {
  const songs = await getSongs();

  songList.innerHTML = songs
    .map((song) => {
      return `
      <div class="song-card" data-id="${song.id}">
        <div>
          <h3>${song.title}</h3>
          <p>${song.artist}</p>
        </div>
        <div class="song-actions ${editable ? "" : " hidden"}">
          <button class="edit-btn" data-id="${song.id}">Edit</button>
          <button class="delete-btn" data-id="${song.id}">Delete</button>
        </div>
      </div>
    `;
    })
    .join("");

  songList.querySelectorAll(".song-card").forEach((button) => {
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
        renderSong(song);
        history.pushState({ action: "render-song" }, "", `#${song.id}`);
      }
    });
  });

  songList.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const songId = (btn as HTMLButtonElement).dataset.id!;
      const song = getSongById(songId);
      showModal(true, song);
    });
  });

  songList.querySelectorAll(".delete-btn").forEach((btn) => {
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
