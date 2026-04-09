export interface Segment {
  chord: string | null;
  text: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  content: Segment[][];
}

export interface SongFormData {
  title: string;
  artist: string;
  content: string; // ChordPro format input
}

export interface AppState {
  songs: Song[];
  filteredSongs: Song[];
  activeSongId: string | null;
  isEditing: boolean;
  currentEditId: string | null;
  searchQuery: string;
}

// DOM element types
export interface SongCardElements {
  card: HTMLButtonElement;
  title: HTMLHeadingElement;
  artist: HTMLParagraphElement;
  actions: HTMLElement;
  editBtn: HTMLButtonElement;
  deleteBtn: HTMLButtonElement;
}

// PWA related types
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
