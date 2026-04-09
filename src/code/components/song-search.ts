const searchInput = document.getElementById("search-input") as HTMLInputElement;

export function initSearch(onSearch: (query: string) => void): void {
  searchInput.addEventListener("input", () => {
    onSearch(searchInput.value);
  });
}

export function getSearchQuery(): string {
  return searchInput.value;
}
