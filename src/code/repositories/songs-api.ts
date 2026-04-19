import { AddSongRequest, AddSongResponse, Song } from "../../types";

export async function updateSong(song: Song): Promise<AddSongResponse | null> {
  try {
    const response = await fetch("/api/songs", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(song),
    });

    const result: AddSongResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to add song");
    }

    console.log("Success:", result.message);
    return result;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

export async function deleteSong(id: string) {
  try {
    await fetch("/api/songs", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
  } catch (error) {
    console.error("API Error:", error);
  }
}

export async function createSong(
  newSong: AddSongRequest,
): Promise<AddSongResponse | null> {
  try {
    const response = await fetch("/api/songs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSong),
    });

    const result: AddSongResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to add song");
    }

    console.log("Success:", result.message);
    return result;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

export async function getSongs(): Promise<Song[]> {
  try {
    const response = await fetch("/api/songs", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Song[] = await response.json();
    return data;
  } catch (error) {
    console.error("Could not fetch songs:", error);
    return [];
  }
}
