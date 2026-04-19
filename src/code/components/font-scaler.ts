const fontPlusBtn = document.getElementById("font+") as HTMLButtonElement;
const fontMinBtn = document.getElementById("font-") as HTMLButtonElement;

let fontSizes: { [id: string]: number } = {};

function calculateSize(el: Element) {
  return parseInt(
    document.defaultView
      ?.getComputedStyle(el, null)
      .getPropertyValue("font-size") ?? "",
  );
}

function scaleFont(selector: string, amount: number) {
  const elements = document.querySelectorAll<HTMLDivElement>(selector);
  if (elements.length <= 0) return;

  if (!fontSizes[selector]) {
    fontSizes[selector] = calculateSize(elements[0]);
  }
  fontSizes[selector] += amount;

  elements.forEach((x) => {
    x.style.fontSize = fontSizes[selector] + "px";
  });
}

export function reloadFontSize() {
  scaleFont(".lyric", 0);
  scaleFont(".chord", 0);
}

export function initFontScaler() {
  const scaleAmountInPX = 1;

  fontPlusBtn?.addEventListener("click", () => {
    scaleFont(".lyric", scaleAmountInPX);
    scaleFont(".chord", scaleAmountInPX);
  });
  fontMinBtn?.addEventListener("click", () => {
    scaleFont(".lyric", -scaleAmountInPX);
    scaleFont(".chord", -scaleAmountInPX);
  });
}
