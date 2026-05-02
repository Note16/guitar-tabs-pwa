import { FretLabelPosition, SVGuitarChord } from "svguitar";
import {
  ChordPosition,
  convertChordShape,
  getChordData,
} from "../parses/chord-svguitar";

const chordButtons = document.querySelector(".chord-buttons") as HTMLDivElement;
const chordSvg = document.getElementById("chord-svg") as HTMLDivElement;
const chordNext = document.getElementById("chord-next") as HTMLButtonElement;
const chordPrev = document.getElementById("chord-prev") as HTMLButtonElement;
const chordClose = document.getElementById("chord-close") as HTMLButtonElement;

let _currentChord: string = "";
const _cache: {
  versions: number;
  currentVersion: number;
  chord: string;
  data: ChordPosition[];
}[] = [];

chordClose.addEventListener("click", () => {
  chordSvg.innerHTML = "";
  chordButtons.classList.add("hidden");
  chordSvg.classList.add("hidden");
});

chordNext.addEventListener("click", () => {
  let cache = getCachedChord(_currentChord);
  let currentVersion = cache?.currentVersion ?? 0;
  let versions = cache?.versions ?? 1;

  if (currentVersion >= versions) {
    chordNext.disabled = true;
    currentVersion = versions;
    return;
  }

  getCachedChord(_currentChord)!.currentVersion++;
  chordPrev.disabled = false;
  displayChordPreview();
});

chordPrev.addEventListener("click", () => {
  let cache = getCachedChord(_currentChord);
  let currentVersion = cache?.currentVersion ?? 0;
  let versions = cache?.versions ?? 1;

  if (currentVersion == 0) {
    chordPrev.disabled = true;
    return;
  }
  if (currentVersion > versions) currentVersion = versions;

  getCachedChord(_currentChord)!.currentVersion--;
  chordNext.disabled = false;
  displayChordPreview();
});

export function renderChordPreview(chordSelector: string) {
  document
    .querySelectorAll<HTMLSpanElement>(chordSelector)
    ?.forEach((chord) => {
      chord.classList.add("pointer");
      chord.addEventListener("click", () => {
        _currentChord = chord.innerText;
        displayChordPreview();
      });
    });
}

function getCachedChord(chordName: string) {
  let cache = _cache.find((x) => x.chord == chordName);
  if (cache) return cache;

  const chordData = getChordData(chordName);
  if (!chordData) return;

  cache = {
    chord: chordName,
    currentVersion: 0,
    versions: chordData.length - 1,
    data: chordData,
  };
  _cache.push(cache);
  return cache;
}

function displayChordPreview() {
  chordSvg.innerHTML = "";
  chordButtons.classList.remove("hidden");
  chordSvg.classList.remove("hidden");
  renderChord(_currentChord);

  const chord = getCachedChord(_currentChord);
  chordPrev.disabled = chord?.currentVersion == 0;
  chordNext.disabled = chord!.currentVersion >= chord!.versions;
}

function renderChord(chordName: string) {
  const chord = getCachedChord(chordName);
  if (chord) {
    const position = chord.data[chord.currentVersion];
    const shape = convertChordShape(position);

    new SVGuitarChord("#" + chordSvg.id)
      .chord({
        title: chordName,
        fingers: shape.fingers,
        barres: shape.barres,
        position: shape.baseFret,
      })
      .configure({
        tuning: ["E", "A", "D", "G", "B", "E"],
        strokeWidth: 2,
        fretLabelPosition: FretLabelPosition.LEFT,
        tuningsFontSize: 28,
        barreChordRadius: 0.5,
        fretLabelFontSize: 80,
        emptyStringIndicatorSize: 0.4,
        fretMarkers: [
          2,
          4,
          6,
          8,
          {
            fret: 11,
            double: true,
          },
        ],
      })
      .draw();
  } else {
    chordSvg.innerHTML = `<p>Chord ${chordName} could not be found in the chords database.</p>`;
  }
}
