import { Song } from "../../types";

const songTitle = document.getElementById("songTitle") as HTMLHeadingElement;
const songArtist = document.getElementById(
  "songArtist",
) as HTMLParagraphElement;
const songContent = document.getElementById("songContent") as HTMLDivElement;

let activeSongId: string | null = null;

export function renderSong(song: Song): void {
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  songContent.innerHTML = song.content
    .map((line) => {
      const segments = line
        .map(
          (segment) =>
            `<span class="segment"><span class="chord">${segment.chord || ""}</span><span class="lyric">${segment.text}</span></span>`,
        )
        .join(" ");
      return `<div class="line">${segments}</div>`;
    })
    .join("");
}
