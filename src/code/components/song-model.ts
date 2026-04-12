import { Song, SongFormData } from "../../types.js";
import { parseChordPro, songToChordPro } from "../parses/chord-pro.js";
import { addSong, getSongById, updateSong } from "../services/songs-service.js";
import { renderSongList } from "./song-list.js";
import { renderSong } from "./song.js";

const modal = document.getElementById("song-modal") as HTMLDivElement;
const form = document.getElementById("song-form") as HTMLFormElement;
const cancelBtn = document.getElementById("btn-cancel") as HTMLButtonElement;
const submitBtn = form.querySelector(
  'button[type="submit"]',
) as HTMLButtonElement;

let currentEditId: string | null = null;

export function initModal(): void {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = (
      document.getElementById("song-title") as HTMLInputElement
    ).value.trim();
    const artist = (
      document.getElementById("song-artist") as HTMLInputElement
    ).value.trim();
    const content = (
      document.getElementById("song-content-input") as HTMLTextAreaElement
    ).value.trim();

    if (!title || !artist || !content) {
      alert("Please fill all fields");
      return;
    }

    FormSubmit({ title, artist, content });
  });

  cancelBtn.addEventListener("click", () => {
    hideModal();
  });
}

export function showModal(isEditing: boolean, song?: Song): void {
  currentEditId = song ? song.id : null;
  submitBtn.textContent = isEditing ? "Update Song" : "Add Song";
  modal.classList.remove("hidden");

  if (song) {
    (document.getElementById("song-title") as HTMLInputElement).value =
      song.title;
    (document.getElementById("song-artist") as HTMLInputElement).value =
      song.artist;
    (
      document.getElementById("song-content-input") as HTMLTextAreaElement
    ).value = songToChordPro(song);
  } else {
    form.reset();
    var input = document.getElementById(
      "song-content-input",
    ) as HTMLTextAreaElement;
    input.value =
      "From: Johan Englund\r\n\r\nThe Unforgiven - Metallica\r\n\r\n\r\n[Intro]\r\n[ch]Am[/ch]\r\n[ch]Am[/ch] [ch]C[/ch] [ch]G[/ch] [ch]Em[/ch]\r\n[ch]Am[/ch] [ch]C[/ch] [ch]G[/ch] [ch]E[/ch]\r\n[ch]Am[/ch]\r\n\r\n\r\n[Verse 1]\r\n[tab][ch]Am[/ch]                   [ch]Em[/ch]        [ch]D[/ch]               [ch]Am[/ch]\r\nNew blood joins this earth and quickly he&#039;s subdued.[/tab]\r\n[tab]        [ch]Am[/ch]                 [ch]Em[/ch]          [ch]D[/ch]                     [ch]Am[/ch]\r\nThrough constant pained disgrace, the young boy learns their rules.[/tab]\r\n[tab]     [ch]Am[/ch]                   [ch]Em[/ch]       [ch]D[/ch]                 [ch]Am[/ch]\r\nWith time the child draws in, this whipping boy done wrong.[/tab]\r\n[tab]  [ch]Am[/ch]                [ch]Em[/ch]             [ch]D[/ch]                  [ch]Am[/ch]\r\nDeprived of all his thoughts, the young man struggles on and on.[/tab]\r\n[tab]                   [ch]C[/ch]             [ch]G[/ch]        [ch]Am[/ch]\r\nHe&#039;s known, ooh, a vow unto his own, that never from this day[/tab]\r\n[tab]    [ch]C[/ch]                  [ch]G[/ch]    [ch]E[/ch]\r\nhis will they&#039;ll take away.[/tab]\r\n\r\n\r\n[Chorus]\r\n[tab][ch]Am[/ch]            [ch]C[/ch]               [ch]G[/ch]            [ch]Em[/ch]                          [ch]Am[/ch]\r\n   What I&#039;ve felt, what I&#039;ve known, never shined through in what I&#039;ve shown.[/tab]\r\n[tab]       [ch]C[/ch]         [ch]G[/ch]         [ch]E[/ch]                   [ch]Am[/ch]\r\nNever be, never see. Won&#039;t see what might have been.[/tab]\r\n[tab]           [ch]C[/ch]               [ch]G[/ch]           [ch]Em[/ch]                           [ch]Am[/ch]\r\nWhat I&#039;ve felt, what I&#039;ve known, never shined through in what I&#039;ve shown.[/tab]\r\n[tab]       [ch]C[/ch]           [ch]G[/ch]       [ch]E[/ch]               [ch]Am[/ch]\r\nNever free, never me. So I dub thee Unforgiven.[/tab]\r\n\r\n\r\n[Verse 2]\r\n[tab]     [ch]Am[/ch]             [ch]Em[/ch]       [ch]D[/ch]              [ch]Am[/ch]\r\nThey dedicate their lives to running all of his[/tab]\r\n[tab]   [ch]Am[/ch]                   [ch]Em[/ch]        [ch]D[/ch]             [ch]Am[/ch]\r\nHe tries to please them all, this bitter man he is[/tab]\r\n[tab]       [ch]Am[/ch]                [ch]Em[/ch]        [ch]D[/ch]               [ch]Am[/ch]\r\nThroughout his life the same, he&#039;s battled constantly[/tab]\r\n[tab]     [ch]Am[/ch]              [ch]Em[/ch]     [ch]D[/ch]              [ch]Am[/ch]\r\nThis fight he cannot win. A tired man they see no longer cares.[/tab]\r\n[tab]    [ch]C[/ch]                [ch]G[/ch]       [ch]Am[/ch]\r\nThe old man then prepares to die regretfully[/tab]\r\n[tab]     [ch]C[/ch]               [ch]G[/ch]   [ch]E[/ch]\r\nThat old man here is me.[/tab]\r\n\r\n\r\n[Chorus]\r\n[tab][ch]Am[/ch]            [ch]C[/ch]               [ch]G[/ch]            [ch]Em[/ch]                          [ch]Am[/ch]\r\n   What I&#039;ve felt, what I&#039;ve known, never shined through in what I&#039;ve shown.[/tab]\r\n[tab]       [ch]C[/ch]         [ch]G[/ch]         [ch]E[/ch]                   [ch]Am[/ch]\r\nNever be, never see. Won&#039;t see what might have been.[/tab]\r\n[tab]           [ch]C[/ch]               [ch]G[/ch]           [ch]Em[/ch]                           [ch]Am[/ch]\r\nWhat I&#039;ve felt, what I&#039;ve known, never shined through in what I&#039;ve shown.[/tab]\r\n[tab]       [ch]C[/ch]           [ch]G[/ch]       [ch]E[/ch]               [ch]Am[/ch]\r\nNever free, never me. So I dub thee Unforgiven.[/tab]\r\n\r\n\r\n[Solo]\r\n[ch]Am[/ch]\r\n[ch]Am[/ch] [ch]Em[/ch] [ch]D[/ch] [ch]Am[/ch]\r\n[ch]Am[/ch] [ch]Em[/ch] [ch]D[/ch] [ch]Am[/ch]\r\n[ch]Am[/ch] [ch]Em[/ch] [ch]D[/ch] [ch]Am[/ch]\r\n[ch]Am[/ch] [ch]Em[/ch] [ch]D[/ch]\r\n[ch]Am[/ch]   [ch]C[/ch] [ch]G[/ch]\r\n[ch]Am[/ch]   [ch]C[/ch] [ch]G[/ch] [ch]E[/ch]\r\n\r\n\r\n[Chorus]\r\n[tab][ch]Am[/ch]            [ch]C[/ch]               [ch]G[/ch]            [ch]Em[/ch]                          [ch]Am[/ch]\r\n   What I&#039;ve felt, what I&#039;ve known, never shined through in what I&#039;ve shown.[/tab]\r\n[tab]       [ch]C[/ch]         [ch]G[/ch]         [ch]E[/ch]                   [ch]Am[/ch]\r\nNever be, never see. Won&#039;t see what might have been.[/tab]\r\n[tab]           [ch]C[/ch]               [ch]G[/ch]           [ch]Em[/ch]                           [ch]Am[/ch]\r\nWhat I&#039;ve felt, what I&#039;ve known, never shined through in what I&#039;ve shown.[/tab]\r\n[tab]       [ch]C[/ch]           [ch]G[/ch]       [ch]E[/ch]               [ch]Am[/ch]   [ch]C[/ch]      [ch]G[/ch]  [ch]Em[/ch]\r\nNever free, never me. So I dub thee Unforgiveeeeeen, ohoh.[/tab]\r\n\r\n\r\n[Interlude]\r\n[ch]Am[/ch] [ch]C[/ch] [ch]G[/ch] [ch]Em[/ch]\r\n\r\n\r\n[Outro]\r\n[tab][ch]Am[/ch]        [ch]C[/ch]           [ch]G[/ch]       [ch]E[/ch]               [ch]Am[/ch]   [ch]C[/ch]   [ch]G[/ch]   [ch]E[/ch]\r\n   Never free, never me. So I dub thee Unforgiveeeeeeeeeen.[/tab]\r\n[tab][ch]Am[/ch]            [ch]C[/ch]           [ch]G[/ch]        [ch]E[/ch]               [ch]Am[/ch]   [ch]C[/ch]   [ch]G[/ch]   [ch]E[/ch]\r\n   You label me, I label you. So I dub thee Unforgiveeeeeeeeeen.[/tab]\r\n[tab][ch]Am[/ch]        [ch]C[/ch]           [ch]G[/ch]       [ch]E[/ch]               [ch]Am[/ch]   [ch]C[/ch]   [ch]G[/ch]   [ch]E[/ch]\r\n   Never free, never me. So I dub thee Unforgiveeeeeeeeeen.[/tab]\r\n[tab][ch]Am[/ch]            [ch]C[/ch]           [ch]G[/ch]        [ch]E[/ch]               [ch]Am[/ch]   [ch]C[/ch]   [ch]G[/ch]   [ch]E[/ch]\r\n   You label me, I label you. So I dub thee Unforgiveeeeeeeeeen.[/tab]\r\n[tab][ch]Am[/ch]        [ch]C[/ch]           [ch]G[/ch]       [ch]E[/ch]               [ch]Am[/ch]   [ch]C[/ch]   [ch]G[/ch]   [ch]E[/ch]   [ch]Am[/ch]\r\n   Never free, never me. So I dub thee Unforgiveeeeeeeeeen.[/tab]\r\n\r\n(fade out)";
  }
}

async function FormSubmit(data: SongFormData): Promise<void> {
  try {
    const content = parseChordPro(data.content);
    if (content.length === 0) {
      alert("Invalid content format. Use [chord]text format.");
      return;
    }

    if (currentEditId) {
      const song = getSongById(currentEditId);
      if (song) {
        song.title = data.title;
        song.artist = data.artist;
        song.content = content;
        await updateSong(song);
        renderSong(song);
      }
    } else {
      const newSong: Song = {
        id: data.title.toLowerCase().replace(/\s+/g, "-"),
        title: data.title,
        artist: data.artist,
        content,
      };
      await addSong(newSong);
    }

    renderSongList();
    hideModal();
  } catch (error) {
    console.error("Failed to save song:", error);
  }
}

export function hideModal(): void {
  currentEditId = null;
  modal.classList.add("hidden");
  form.reset();
}
