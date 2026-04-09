# Guitar Tabs PWA

A mobile-first Progressive Web App for reading and managing guitar song tabs with chords and lyrics.

## Features

- **Song Library**: Store and organize your personal collection of songs
- **Chord Display**: Clean mobile-optimized chord and lyrics rendering
- **Offline Support**: Works offline with cached songs
- **PWA Installation**: Install as a native app on mobile devices
- **Search & Filter**: Find songs by title or artist
- **ChordPro Import**: Add songs using simple chord annotation format

## Tech Stack

- **Frontend**: TypeScript, HTML5, CSS3
- **Build Tool**: Vite
- **Storage**: IndexedDB (browser-based)
- **PWA**: Service Worker, Web App Manifest

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm

### Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start development server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000

4. Build for production:
   ```bash
   npm run build
   ```

## Usage

### Adding Songs

1. Click "Add song" button
2. Enter title, artist, and content
3. Use ChordPro format: `[G]When you were here before`
4. Save to add to your library

### Viewing Songs

- Select a song from the list to view chords and lyrics
- Chords appear above the corresponding lyrics
- Optimized for mobile reading

### PWA Features

- **Install**: Click "Install App" when prompted on mobile
- **Offline**: Songs are cached and available offline
- **Home Screen**: Appears as native app icon

## ChordPro Format

Simple bracketed syntax for chords:

```
[G]When you were here before [B]couldn't look you in the eye
[C]You float like a feather [G]in a beautiful world
```

## License

MIT License
