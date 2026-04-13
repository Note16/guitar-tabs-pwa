import {
  songListPanelHidden,
  songViewIsHidden,
  togglePanels,
} from "../components/panels";
import { renderSong } from "../components/song";
import { hideModal, showModal } from "../components/song-model";
import { getSongById } from "./songs-service";

export function getRoute() {
  const hash = window.location.hash.slice(1)?.split("*");
  const songId = hash[0];
  const modal = hash[1];
  return {
    song: getSongById(songId),
    modal: modal,
  };
}

export function initRouter() {
  window.addEventListener("popstate", (event: PopStateEvent) => {
    const route = getRoute();
    if (!route.modal) {
      hideModal();
    } else {
      showModal(route.modal == "edit", route.song);
    }

    if (route.song) {
      renderSong(route.song);

      if (songViewIsHidden()) {
        togglePanels();
      }
      return;
    } else if (songListPanelHidden()) {
      togglePanels();
    }
  });

  let route = getRoute();
  if (route.song) {
    togglePanels();
    renderSong(route.song);
  }
  if (route.modal) {
    showModal(route.modal == "edit", route.song);
  }
}
