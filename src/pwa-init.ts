/**
 * Register service worker and handle updates
 */
export async function initPWA(): Promise<void> {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });

    // Check for updates periodically (every hour)
    setInterval(() => {
      registration.update();
    }, 3600000);

    // Listen for controller change (new SW activated)
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log("[PWA] Service Worker controller changed");
      window.location.reload();
    });
  } catch (error) {
    console.error("[PWA] Service Worker registration failed:", error);
  }
}
