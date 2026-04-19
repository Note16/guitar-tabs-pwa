export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  user?: string;
  error?: string;
}

export interface AddSongRequest {
  title: string;
  artist: string;
  content: string;
}

export interface AddSongResponse {
  message?: string;
  id?: string;
  error?: string;
}

export interface Segment {
  chord: string | null;
  text: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  content: string;
}

export interface SongFormData {
  title: string;
  artist: string;
  content: string;
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}
