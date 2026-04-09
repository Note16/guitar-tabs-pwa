import type { BeforeInstallPromptEvent } from "../../types.js";

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const btnInstall = document.getElementById("btn-install") as HTMLButtonElement;

function isInstalled(): boolean {
  const UA = navigator.userAgent;
  const IOS = UA.match(/iPhone|iPad|iPod/);
  const standalone = window.matchMedia("(display-mode: standalone)").matches;

  return !!(standalone || (IOS && !UA.match(/Safari/)));
}

export function initPWA(): void {
  if (isInstalled()) return;

  // Handle install prompt
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    btnInstall?.classList.remove("hidden");
  });

  if (btnInstall) {
    btnInstall.addEventListener("click", () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt");
          } else {
            console.log("User dismissed the install prompt");
          }
          deferredPrompt = null;
        });
      } else {
        alert(
          "App is not installable. PWA installation requires HTTPS (or localhost). Please access via https:// or localhost for installation.",
        );
      }
    });
  }

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    if (btnInstall) {
      btnInstall?.classList.add("hidden");
    }
  });
}
