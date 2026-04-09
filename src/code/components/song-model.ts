import { Song, SongFormData } from "../../types.js";
import { songToChordPro } from "../parses/chord-pro.js";

// Modal functions
const modal = document.getElementById("song-modal") as HTMLDivElement;
const form = document.getElementById("song-form") as HTMLFormElement;
const cancelBtn = document.getElementById("song-cancel") as HTMLButtonElement;
const submitBtn = form.querySelector(
  'button[type="submit"]',
) as HTMLButtonElement;

export function initModal(
  onSubmit: (data: SongFormData) => void,
  onCancel: () => void,
): void {
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

    onSubmit({ title, artist, content });
  });

  cancelBtn.addEventListener("click", () => {
    hideModal();
    onCancel();
  });
}

export function showModal(isEditing: boolean, song?: Song): void {
  submitBtn.textContent = isEditing ? "Update Song" : "Add Song";
  modal.classList.remove("hidden");

  if (song) {
    (document.getElementById("song-title") as HTMLInputElement).value =
      song.title;
    (document.getElementById("song-artist") as HTMLInputElement).value =
      song.artist;
    (
      document.getElementById("song-content-input") as HTMLTextAreaElement
    ).value = songToChordPro(song);
  } else {
    form.reset();
  }
}

export function hideModal(): void {
  modal.classList.add("hidden");
  form.reset();
}
