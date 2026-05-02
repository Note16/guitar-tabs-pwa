import { Barre, Finger } from "svguitar";
import db from "../../data/guitar-chords.json";

export interface ChordPosition {
  frets: number[];
  fingers: number[];
  barres: number[];
  capo?: boolean;
  baseFret: number;
}

const ROOT_REGEX = /^[A-G](#|b)?/;
export function getChordData(chordName: string): ChordPosition[] | null {
  // 1. Extract root
  const rootMatch = chordName.match(ROOT_REGEX);
  if (!rootMatch) return null;
  const root = rootMatch[0];

  // 2. Exit if chord does not exist
  const chords = Object.values(db.chords).flatMap((c) =>
    c.filter((x) => x.key == root),
  );
  if (!chords) return null;

  const rest = chordName.slice(root.length);

  // 3. Sort suffixes by length (longest first!)
  const sortedSuffixes = [...db.suffixes].sort((a, b) => b.length - a.length);

  // 4. Try exact match
  let suffix = sortedSuffixes.find((s) => rest === s);

  // 5. Handle minor shorthand ("m")
  if (!suffix && rest === "m" && sortedSuffixes.includes("minor")) {
    suffix = "minor";
  }

  // 6. Handle empty = major
  if (!suffix && rest === "") {
    if (sortedSuffixes.includes("major")) {
      suffix = "major";
    }
  }

  return chords.find((c) => c.suffix === suffix)?.positions ?? null;
}

export function convertChordShape(position: ChordPosition): {
  fingers: Finger[];
  barres: Barre[];
  baseFret: number;
} {
  const fingerResult: Finger[] = [];
  const stringCount = position.frets.length;
  for (let i = 0; i < stringCount; i++) {
    const stringNumber = stringCount - i; // reverse (6 → 1)
    const fret = position.frets[i];
    const finger = position.fingers[i];

    // Muted string
    if (fret === -1) {
      fingerResult.push([stringNumber, "x"]);
      continue;
    }

    // Open string
    if (fret === 0) {
      fingerResult.push([stringNumber, 0, ""]);
      continue;
    }

    // Fretted note
    fingerResult.push([stringNumber, fret, finger.toString()]);
  }
  let barres: Barre[] = [];
  position.barres.forEach((b) => {
    // Check if [1] the fret is a barre
    const positions = fingerResult.filter((finger) => finger[1] == b);
    if (positions) {
      const startPos = positions[0];
      const endPos = positions[positions.length - 1];

      barres.push({
        fromString: startPos[0],
        toString: endPos[0],
        fret: b,
      });
    }
  });

  return {
    fingers: fingerResult.reverse(),
    barres,
    baseFret: position.baseFret,
  }; // flip to string 1 → 6
}
