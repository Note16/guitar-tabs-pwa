const songListPanel = document.querySelector(
  ".song-list-panel",
) as HTMLDivElement;
const songViewPanel = document.querySelector(
  ".song-view-panel",
) as HTMLDivElement;
const loginPanel = document.querySelector(".login-panel") as HTMLDivElement;
const autoScroller = document.querySelector(".autoscroll") as HTMLDivElement;
const btnBar = document.querySelector(".btn-bar") as HTMLDivElement;
const addBtn = document.getElementById("btn-add") as HTMLButtonElement;
const fontSizeButtons = document.querySelector(
  ".font-size-buttons",
) as HTMLDivElement;

export function toggleLoginPanel(): void {
  loginPanel.classList.toggle("hidden");
}

export function togglePanels(): void {
  songListPanel.classList.toggle("hidden");
  songViewPanel.classList.toggle("hidden");
  autoScroller.classList.toggle("hidden");
  fontSizeButtons.classList.toggle("hidden");
  btnBar.classList.toggle("hidden");
}

export function songViewIsHidden() {
  return songViewPanel.classList.contains("hidden");
}

export function songListPanelHidden() {
  return songListPanel.classList.contains("hidden");
}

export function toggleAddButton() {
  addBtn.classList.toggle("hidden");
}
