import { setSearchQuery } from "../services/songs-service";
import { renderSongList } from "./song-list";

const searchInput = document.getElementById("search-input") as HTMLInputElement;
const itemCounter = document.getElementById("item-counter") as HTMLSpanElement;

async function updateItemCounter() {
  const songs = await renderSongList();
  itemCounter.innerText = songs.length.toString();
}

export async function initSearch(): Promise<void> {
  updateItemCounter();

  searchInput.addEventListener("input", async () => {
    setSearchQuery(searchInput.value);
    updateItemCounter();
  });
}

export function getSearchQuery(): string {
  return searchInput.value;
}
