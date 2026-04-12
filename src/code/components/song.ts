import { Song } from "../../types";
import { showModal } from "./song-model";

const songTitle = document.getElementById("songTitle") as HTMLHeadingElement;
const songArtist = document.getElementById(
  "songArtist",
) as HTMLParagraphElement;
const songContent = document.getElementById("songContent") as HTMLDivElement;
const btnEdit = document.getElementById("btn-edit") as HTMLButtonElement;

export function renderSong(song: Song): void {
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

  btnEdit.addEventListener("click", (e) => {
    e.stopPropagation();
    showModal(true, song);
  });
}
