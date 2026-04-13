const songListPanel = document.querySelector(
  ".song-list-panel",
) as HTMLDivElement;
const songViewPanel = document.querySelector(
  ".song-view-panel",
) as HTMLDivElement;

export function togglePanels(): void {
  songListPanel.classList.toggle("hidden");
  songViewPanel.classList.toggle("hidden");
}

export function songViewIsHidden() {
  return songViewPanel.classList.contains("hidden");
}

export function songListPanelHidden() {
  return songListPanel.classList.contains("hidden");
}
