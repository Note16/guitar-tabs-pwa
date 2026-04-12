import { setSearchQuery } from "../services/songs-service";
import { renderSongList } from "./song-list";

const searchInput = document.getElementById("search-input") as HTMLInputElement;

export function initSearch(): void {
  searchInput.addEventListener("input", () => {
    setSearchQuery(searchInput.value);
    renderSongList();
  });
}

export function getSearchQuery(): string {
  return searchInput.value;
}
