# Ambient audio — drop your MP3s here

The Rukn audio engine looks in this folder *first* for ambient sound files. If a matching file exists, it's played in a loop. If it doesn't, the engine falls back to procedural Web Audio synthesis (no MP3 needed).

## Filenames

Use exactly these names so the engine picks them up:

| Sound chip | File to drop here |
|---|---|
| Rain | `rain.mp3` |
| Fireplace | `fireplace.mp3` |
| Café | `cafe.mp3` |
| Forest | `forest.mp3` |
| Lofi | `lofi.mp3` |

Lowercase, no underscores, no spaces. `.mp3` extension only.

## Where to find legally-clear audio

- **Pixabay** — <https://pixabay.com/sound-effects/> — free to use, no attribution required. Search "rain ambient", "fireplace crackling", "café ambience", "forest birds", "lofi beat". Download the MP3.
- **Freesound.org** — huge library, mostly CC0/CC-BY (read the license on each file).
- **Mixkit** — <https://mixkit.co/free-sound-effects/ambient/> — free with attribution.
- **YouTube Audio Library** — built-in to YouTube Studio, free to use.

For a 1-hour ambient loop, aim for files **2–10 MB each**. Anything larger bloats your submission zip.

## Tip — loop seamlessly

The engine sets `loop = true` on the `<audio>` element, so the file will repeat automatically. Pick a clip that doesn't have a hard stop at the end. Most "10-minute rain" or "1-hour fireplace" downloads loop cleanly.

## How to test

1. Drop one file (say `rain.mp3`) into this folder.
2. Hard-refresh the browser (Ctrl+Shift+R).
3. Click the **Rain** chip in the Sounds widget.

If the file is there, you hear it within a second. If not, the procedural synth kicks in and you'll hear the generated version instead — either way the app keeps working.

## Removing a file falls back to synthesis

Delete `rain.mp3` and the rain chip will go back to using the synthesized rain. No code changes needed.
