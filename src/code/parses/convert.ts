function mergeChordAndLyric(chordLine: string, lyricLine: string): string {
  const chordRegex = /\[ch\]([^\[]*)\[\/ch\]/g;
  let result = "";
  let lastIndex = 0;
  let match;
  while ((match = chordRegex.exec(chordLine)) !== null) {
    const chord = match[1];
    const chordPosition = match.index;
    const correctedPosition =
      chordPosition - 8.2 * (result.match(/\[([^\]]*)\]/g)?.length || 0);

    // Add the lyric part before the chord
    result += lyricLine.slice(lastIndex, correctedPosition);
    // Add the chord in [chord] format
    result += `[${chord}]`;
    lastIndex = correctedPosition;
  }
  // Add any remaining lyric part after the last chord
  result += lyricLine.slice(lastIndex);
  return result;
}

export function isTabbedContent(text: string): boolean {
  return /\[tab\]/.test(text);
}

export function convertTabbedContent(text: string): string {
  // parse html entities
  const parser = new DOMParser();
  text = parser.parseFromString(text, "text/html").documentElement.textContent;

  text = text.replace(/\[\/?tab\]/g, "");

  const lines = text.split("\n");
  let newText = "";

  const isChord = (line: string) => /\[ch\]([^\[]*)\[\/ch\]/.test(line);
  const isHeading = (line: string) => /\[[^\]]*\]/.test(line) && !isChord(line);
  const isLyric = (line: string) => !isChord(line);

  lines.forEach((line, index) => {
    // If is a chord line we convert [ch]Am[/ch] to [Am]
    if (isChord(line)) {
      // If contains | we remove |
      line = line.replace(/\|/g, "");

      // If next line is lyric line we merge chord line and lyric line to one line with chords in the right place
      if (isLyric(lines[index + 1]) && lines[index + 1]) {
        const chordLine = line;
        const lyricLine = lines[index + 1];

        const mergedLine = mergeChordAndLyric(chordLine, lyricLine);
        newText += mergedLine + "\n";
      } else {
        // We shoud also remove all whitespsaces
        newText +=
          line
            .replace(/\[ch\]([^\[]*)\[\/ch\]/g, (_, chord) => {
              return `[${chord}]`;
            })
            .replace(/\s+/g, "") + "\n";
      }
    }

    // If is heading line we convert [Intro] to {Intro}
    if (isHeading(line)) {
      line = line.replace(/\[([^\]]*)\]/g, (_, heading) => {
        return `{${heading}}`;
      });
    }

    if (isLyric(line) && !isChord(lines[index - 1])) {
      newText += line + "\n";
    }
  });

  return newText;
}
