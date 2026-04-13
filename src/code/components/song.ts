import { Song } from "../../types";
import { reloadFontSize } from "./font-scaler";
import { showModal } from "./song-model";

const songTitle = document.getElementById("songTitle") as HTMLHeadingElement;
const songArtist = document.getElementById(
  "songArtist",
) as HTMLParagraphElement;
const songContent = document.getElementById("songContent") as HTMLDivElement;
let song: Song | null = null;
const btnEdit = document.getElementById("btn-edit") as HTMLButtonElement;

btnEdit.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!song) return;
  showModal(true, song);
});

export function renderSong(newSong: Song): void {
  song = newSong;

  if (!song) {
    songTitle.textContent = "No song selected";
    songArtist.textContent = "";
    songContent.innerHTML = "";
    return;
  }

  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  songContent.innerHTML = song.content
    .map((line) => {
      const segments = line
        .map(
          (segment) =>
            `${segment.chord ? `<span class="chord${!segment.chord ? " hidden" : ""}">${segment.chord}</span>` : ""}` +
            `${segment.text ? `<span class="lyric">${segment.text.replace("{", "<strong>").replace("}", "</strong>")}</span>` : ""}`,
        )
        .join("");
      return `<div class="line">${segments}<br/></div>`;
    })
    .join("");

  reloadFontSize();
}
