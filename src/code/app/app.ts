import { initPWA } from "../components/pwa.js";
import { renderSongList } from "../components/song-list.js";
import { initSearch } from "../components/song-search.js";
import { initModal, showModal } from "../components/song-model.js";
import { initOfflineIndicator } from "../components/offline-indicator.js";
import { getSongs } from "../services/songs-service.js";
import { initRouter } from "../services/router.js";
import { InitFontScaler } from "../components/font-scaler.js";

const addBtn = document.getElementById("btn-add") as HTMLButtonElement;

async function initApp(): Promise<void> {
  try {
    await getSongs();

    addBtn.addEventListener("click", () => {
      showModal(false);
    });

    initSearch();
    initModal();
    initOfflineIndicator();
    initPWA();
    initRouter();

    renderSongList();
    InitFontScaler();

    console.log("app initialized");
  } catch (error) {
    console.error("Failed to initialize app:", error);
  }
}

export { initApp };
