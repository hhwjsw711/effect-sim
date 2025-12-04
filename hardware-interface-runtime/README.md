# Hardware Interface Runtime

This part interfaces with the hardware and can optionally play playlists directly without driving the UI.

## Running

```bash
bun run hwir
```

The CLI will prompt you to select a project and playlist on first run, then save those settings to `.hwir-config.json` for future runs.

### CLI Options

```bash
# Use saved settings (default behavior after first run)
bun run hwir

# Reset saved settings and choose again
bun run hwir --reset

# Specify project/playlist directly
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
- Only updates when working directory is clean (no uncommitted changes)
