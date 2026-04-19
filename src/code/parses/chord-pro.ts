import { Segment } from "../../types.js";

export function parseChordPro(text: string): Segment[][] {
  const lines = text.split("\n");
  const content: Segment[][] = [];

  lines.forEach((line) => {
    const segments: Segment[] = [];
    const regex = /\[([^\]]*)\]([^[]*)/g;
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(line)) !== null) {
      // Add any text before the chord as a segment without chord
      if (match.index > lastIndex) {
        const beforeText = line.slice(lastIndex, match.index);
        if (beforeText.trim()) {
          segments.push({ chord: null, text: beforeText });
        }
      }

      segments.push({ chord: match[1], text: match[2] });
      lastIndex = regex.lastIndex;
    }

    // Add any remaining text after the last chord
    if (lastIndex < line.length) {
      const remainingText = line.slice(lastIndex);
      if (remainingText.trim()) {
        segments.push({ chord: null, text: remainingText });
      }
    }

    if (segments.length > 0) {
      content.push(segments);
    }
  });

  return content;
}

export function songToChordPro(content: Segment[][]): string {
  return content
    .map((line) =>
      line
        .map(
          (segment) =>
            `${segment.chord ? `[${segment.chord}]` : ""}${segment.text}`,
        )
        .join(""),
    )
    .join("\n");
}
