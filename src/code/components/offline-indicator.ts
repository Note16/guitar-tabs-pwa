const offlineIndicator = document.getElementById(
  "offline-indicator",
) as HTMLDivElement;

export function initOfflineIndicator(): void {
  // Handle offline/online indicators
  if (offlineIndicator) {
    window.addEventListener("online", () => {
      offlineIndicator.classList.add("hidden");
    });

    window.addEventListener("offline", () => {
      offlineIndicator.classList.remove("hidden");
    });

    if (!navigator.onLine) {
      offlineIndicator.classList.remove("hidden");
    }
  }
}
