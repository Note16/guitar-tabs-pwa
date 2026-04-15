import { initApp } from "./code/app/app.js";
import { initPWA } from "./pwa-init.js";
import "./style/styles.css";

// Initialize PWA (service worker registration)
initPWA();

// Initialize app
document.addEventListener("DOMContentLoaded", initApp);
