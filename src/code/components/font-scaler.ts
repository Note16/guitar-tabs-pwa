const fontPlusBtn = document.getElementById("font+") as HTMLButtonElement;
const fontMinBtn = document.getElementById("font-") as HTMLButtonElement;

let fontSizes: { [id: string]: number } = {};

function getRootFontSize(): number {
  return parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function pxToRem(px: number): number {
  return px / getRootFontSize();
}

function calculateSizeInRem(el: Element): number {
  const px = parseFloat(getComputedStyle(el).getPropertyValue("font-size"));
  return pxToRem(px);
}

function scaleFont(selector: string, amount: number) {
  const elements = document.querySelectorAll<HTMLElement>(selector);
  if (elements.length <= 0) return;

  if (!fontSizes[selector]) {
    fontSizes[selector] = calculateSizeInRem(elements[0]);
  }

  fontSizes[selector] += amount;

  elements.forEach((x) => {
    x.style.fontSize = `${fontSizes[selector]}rem`;
  });
}

export function reloadFontSize() {
  scaleFont(".lyric", 0);
  scaleFont(".chord", 0);
}

export function initFontScaler() {
  const scaleAmountInRem = 0.1; // ~1.6px if root = 16px

  fontPlusBtn?.addEventListener("click", () => {
    scaleFont(".lyric", scaleAmountInRem);
    scaleFont(".chord", scaleAmountInRem);
  });

  fontMinBtn?.addEventListener("click", () => {
    scaleFont(".lyric", -scaleAmountInRem);
    scaleFont(".chord", -scaleAmountInRem);
  });
}
