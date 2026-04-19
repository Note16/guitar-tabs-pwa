import { LoginRequest, LoginResponse } from "../../types";

export async function Login(
  request: LoginRequest,
): Promise<LoginResponse | null> {
  const response = await fetch("/api/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const result: LoginResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to log in");
  }
  return result;
}

export async function getStatus(): Promise<LoginResponse | null> {
  const response = await fetch("/api/login", {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: LoginResponse = await response.json();
  return data;
}

export async function Logout(): Promise<void> {
  const response = await fetch("/api/login?logout", {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}
