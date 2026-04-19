import { initPWA } from "../components/pwa.js";
import { renderSongList } from "../components/song-list.js";
import { initSearch } from "../components/song-search.js";
import { initModal, showModal } from "../components/song-model.js";
import { initOfflineIndicator } from "../components/offline-indicator.js";
import { getSongs } from "../services/songs-service.js";
import { initRouter } from "../services/router.js";
import { initFontScaler } from "../components/font-scaler.js";
import { initAutoScroller } from "../components/auto-scroller.js";
import { initLogin } from "../components/login.js";

const addBtn = document.getElementById("btn-add") as HTMLButtonElement;

async function initApp(): Promise<void> {
  try {
    await getSongs();

    addBtn.addEventListener("click", () => {
      showModal(false);
    });

    initLogin();
    initSearch();
    initModal();
    initOfflineIndicator();
    initRouter();
    initFontScaler();
    initAutoScroller();
    initPWA();

    renderSongList();
  } catch (error) {
    console.error("Failed to initialize app:", error);
  }
}

export { initApp };
