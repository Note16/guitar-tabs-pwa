import { initPWA } from "../components/pwa.js";
import { renderSongList } from "../components/song-list.js";
import { initSearch } from "../components/song-search.js";
import { initModal, showModal } from "../components/song-model.js";
import { initOfflineIndicator } from "../components/offline-indicator.js";
import { getLastSelectedSong, getSongs } from "../services/songs-service.js";
import { renderSong } from "../components/song.js";
import { togglePanels } from "../components/panels.js";

const addBtn = document.getElementById("btn-add") as HTMLButtonElement;
const backBtn = document.getElementById("btn-back") as HTMLButtonElement;

async function initApp(): Promise<void> {
  try {
    await getSongs();

    addBtn.addEventListener("click", () => {
      showModal(false);
    });

    backBtn?.addEventListener("click", () => {
      localStorage.removeItem("guitar-tabs-last-selected-song");
      togglePanels();
      history.replaceState({ isSongView: false }, "");
    });

    window.addEventListener("popstate", (event: PopStateEvent) => {
      if (event.state && event.state.isSongView === false) {
        togglePanels();
      }
    });

    initSearch();
    initModal();
    initOfflineIndicator();
    initPWA();

    const persistedSong = getLastSelectedSong();
    if (persistedSong) {
      togglePanels();
      renderSong(persistedSong);
      history.replaceState({ isSongView: true }, "");
    }
    renderSongList();
  } catch (error) {
    console.error("Failed to initialize app:", error);
  }
}

export { initApp };
