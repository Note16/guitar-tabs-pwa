const scrollSpeedSpan = document.getElementById(
  "scroll-speed",
) as HTMLSpanElement;
const scrollPlusBtn = document.getElementById("scroll+") as HTMLButtonElement;
const scrollMinBtn = document.getElementById("scroll-") as HTMLButtonElement;
const scrollStartBtn = document.getElementById(
  "scroll-start",
) as HTMLButtonElement;

let scrollSpeed = 100;
let scrolldelay: number | null;

function adjustSpeed(amount: number) {
  scrollSpeed += amount;

  scrollSpeedSpan.innerText = (10 + -scrollSpeed / 10).toString();
}

export function initAutoScroller() {
  scrollSpeedSpan.innerText = (scrollSpeed / 10).toString();

  scrollStartBtn.addEventListener("click", () => {
    if (scrolldelay) {
      clearTimeout(scrolldelay);
      scrolldelay = null;
      scrollStartBtn.innerText = "Start";
    } else {
      function pageScroll() {
        window.scrollBy(0, 1);
        scrolldelay = setTimeout(pageScroll, scrollSpeed);
      }
      pageScroll();
      scrollStartBtn.innerText = "Stop";
    }
  });

  scrollPlusBtn.addEventListener("click", () => {
    adjustSpeed(-10);
  });

  scrollMinBtn.addEventListener("click", () => {
    adjustSpeed(10);
  });
}
