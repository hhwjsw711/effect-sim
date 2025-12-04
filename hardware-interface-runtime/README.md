# Hardware Interface Runtime

This part interfaces with the hardware and can optionally play playlists directly without driving the UI.

## Features

- **Headless Playlist Playback**: Run LED sequences without the UI
- **Hardware Control**: Direct interface with WLED and other LED hardware
- **Auto-Updates**: Automatically checks for and applies updates from git every 5 minutes

## Auto-Update System

The HWIR includes an automatic update system that keeps itself up-to-date:

- Periodically checks git for updates (default: every 5 minutes)
- Automatically pulls updates, installs dependencies, and restarts
- Safe: only updates when working directory is clean
- Robust error handling with detailed logging

See [AUTO_UPDATE.md](./AUTO_UPDATE.md) for complete documentation.

### Disable Auto-Updates

```bash
export HWIR_AUTO_UPDATE=false
bun run hwir
```

## Running

```bash
bun run hwir
```

The CLI will prompt you to select a project and playlist on first run.
