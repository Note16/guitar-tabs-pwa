import {
  songListPanelHidden,
  songViewIsHidden,
  togglePanels,
} from "../components/panels";
import { renderSong } from "../components/song";
import { hideModal, showModal } from "../components/song-model";
import { getSongById } from "./songs-service";

function getHash() {
  return window.location.hash;
}

export function getRoute() {
  const hash = getHash().slice(1)?.split("*");
  const songId = hash[0];
  const modal = hash[1];
  return {
    song: getSongById(songId),
    modal: modal,
  };
}

export function pushRouteHistory(
  name: "song" | "model-edit" | "model",
  songId: string,
) {
  let url = `#${songId}`;
  if (name == "model") url += "*new";
  if (name == "model-edit") url += "*edit";

  if (getHash() == url) return;

  history.pushState({ action: "name" }, "", url);
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
