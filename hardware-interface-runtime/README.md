# Hardware Interface Runtime

This part interfaces with the hardware and can optionally play playlists directly without driving the UI.

## Running

```bash
bun run hwir
```

The CLI will prompt you to select a project and playlist each time you start.

### CLI Options

```bash
# Normal startup (always prompts)
bun run hwir

# Specify project/playlist directly (skips prompts)
bun run hwir -p <projectId> -l <playlistId>
```

## Auto-Update System

Enable auto-updates to keep HWIR up-to-date automatically:

```bash
# Enable auto-updates
export HWIR_AUTO_UPDATE=true
bun run hwir

# Or on Windows PowerShell
$env:HWIR_AUTO_UPDATE="true"
bun run hwir
```

When enabled:

- Checks git for updates every 1 minute
- Automatically pulls, installs deps, and restarts
- Preserves your project/playlist selection across restarts
- Only updates when working directory is clean (no uncommitted changes)
