/**
 * Custom Service Worker for Guitar Tabs PWA
 * Uses network-first strategy: try network, fallback to cache
 */

const APP_VERSION = "v1";
const APP_CACHE = `app-${APP_VERSION}`;
const API_CACHE = `api-${APP_VERSION}`;
const CACHE_URLS = ["/", "/index.html"];

const sw = self as unknown as ServiceWorkerGlobalScope;

/**
 * Install event: Cache core app shell
 */
sw.addEventListener("install", (event: ExtendableEvent) => {
  console.log("[SW] Installing service worker...");
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) => {
      console.log("[SW] Caching app shell...");
      return cache.addAll(CACHE_URLS);
    }),
  );
  // Activate immediately, don't wait for controlled pages to close
  sw.skipWaiting();
});

/**
 * Activate event: Clean up old caches
 */
sw.addEventListener("activate", (event: ExtendableEvent) => {
  console.log("[SW] Activating service worker...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== APP_CACHE && cacheName !== API_CACHE) {
            console.log("[SW] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  // Take control of all clients immediately
  sw.clients.claim();
});

/**
 * Fetch event: Network-first strategy
 * 1. Try to fetch from network
 * 2. If network fails (offline), return cached response
 * 3. For API calls, cache successful responses for later use
 */
sw.addEventListener("fetch", (event: FetchEvent) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome extensions and other special protocols
  if (!request.url.startsWith("http")) {
    return;
  }

  event.respondWith(networkFirst(request));
});

/**
 * Network-first strategy with cache fallback and timeout
 */
async function networkFirst(request: Request): Promise<Response> {
  const cacheName = request.url.includes("/api/") ? API_CACHE : APP_CACHE;

  try {
    // Try network request with 5 second timeout
    const networkPromise = fetchWithTimeout(request, 5000);
    const response = await networkPromise;

    // Cache successful responses
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // Network failed, try cache
    console.log("[SW] Network request failed, trying cache:", request.url);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // No cache available, return offline response
    return new Response("Offline - Resource not available", {
      status: 503,
      statusText: "Service Unavailable",
      headers: new Headers({
        "Content-Type": "text/plain",
      }),
    });
  }
}

/**
 * Fetch with timeout
 */
function fetchWithTimeout(
  request: Request,
  timeoutMs: number,
): Promise<Response> {
  return Promise.race([
    fetch(request),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Fetch timeout")), timeoutMs),
    ),
  ]);
}
