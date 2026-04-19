import { LoginRequest } from "../../types";
import { getStatus, Login, Logout } from "../repositories/login-api";
import { toggleAddButton, toggleLoginPanel } from "./panels";
import { renderSongList } from "./song-list";

const btnLogin = document.getElementById("btn-login") as HTMLButtonElement;
const btnLogout = document.getElementById("btn-logout") as HTMLButtonElement;
const form = document.getElementById("login-form") as HTMLFormElement;
const cancelBtn = document.getElementById("login-cancel") as HTMLButtonElement;
const errorDiv = form?.querySelector(".error") as HTMLDivElement;
const welcomeMessage = document.getElementById(
  "welcome-message",
) as HTMLSpanElement;

let _userPromise: Promise<string> | null = null;

export function initLogin(): void {
  btnLogin.addEventListener("click", toggleLoginPanel);
  btnLogout.addEventListener("click", async () => {
    await Logout();
    location.reload();
  });

  getUsername().then((name) => {
    if (name) {
      setWelcomeMessage(name);
      toggleButtons();
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = (
      document.getElementById("username") as HTMLInputElement
    ).value.trim();
    const password = (
      document.getElementById("password") as HTMLInputElement
    ).value.trim();

    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }

    FormSubmit({ username, password });
  });

  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleLoginPanel();
  });
}

async function FormSubmit(data: LoginRequest): Promise<void> {
  try {
    const response = await Login(data);
    toggleLoginPanel();
    toggleButtons();
    toggleAddButton();
    setWelcomeMessage(response?.user!);
    renderSongList();
  } catch (error) {
    console.error("Failed to login:", error);
    errorDiv.innerText = "Failed to log in";
  }
}

function setWelcomeMessage(user: string) {
  welcomeMessage.innerHTML = `Hi, ${user}`;
}

export async function getUsername(): Promise<string> {
  if (_userPromise) return _userPromise;

  _userPromise = (async () => {
    try {
      const response = await getStatus();
      return response?.user ?? "";
    } finally {
      _userPromise = null;
    }
  })();

  return _userPromise;
}

export async function isLoggedIn(): Promise<boolean> {
  return !!(await getUsername());
}

function toggleButtons() {
  toggleAddButton();
  btnLogin.classList.toggle("hidden");
  btnLogout.classList.toggle("hidden");
}
