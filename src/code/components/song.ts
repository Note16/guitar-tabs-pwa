import { Song } from "../../types";
import { parseChordPro } from "../parses/chord-pro";
import { renderChordPreview } from "./chord-preview";
import { reloadFontSize } from "./font-scaler";
import { isLoggedIn } from "./login";
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

export function toggleEditSongButton() {
  btnEdit.classList.toggle("hidden");
}

export function renderSong(newSong: Song): void {
  isLoggedIn().then((flag) =>
    flag ? btnEdit.classList.remove("hidden") : btnEdit.classList.add("hidden"),
  );

  song = newSong;

  if (!song) {
    songTitle.textContent = "No song selected";
    songArtist.textContent = "";
    songContent.innerHTML = "";
    return;
  }

  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  songContent.innerHTML = parseChordPro(song.content)
    .map((line) => {
      const segments = line
        .map(
          (segment) =>
            parseChordSegment(segment.chord) + parseTextSegment(segment.text),
        )
        .join("");
      return `<div class="line">${segments}<br/></div>`;
    })
    .join("");

  reloadFontSize();
  renderChordPreview(".chord");
}

function parseChordSegment(chord: string | null) {
  if (!chord) return "";

  return `<span class="chord${!chord ? " hidden" : ""}">${chord}</span>`;
}

function parseTextSegment(text: string) {
  if (!text) return "";

  if (text.indexOf("{") < 0) {
    return text
      .split(" ")
      .map((word) => `<span class="lyric">${word}</span>`)
      .join("&nbsp;");
  }

  text = text.replace("{", "<strong>").replace("}", "</strong>");
  return `<span class="lyric">${text}</span>`;
}
