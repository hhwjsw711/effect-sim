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

### How the restart is coordinated (macOS launchd setup)

- `launchd` (via com.mikecann.effect-sim.hwir.plist) runs `bun run hwir` and keeps it alive.
- `AutoUpdater` detects a remote commit, runs `hardware-interface-runtime/updateAndRestart.ts` _synchronously_ (no detached child), then exits.
- The update script waits a few seconds for the parent to be gone, does `git pull` + `bun install`, and exits without spawning HWIR itself.
- Because `KeepAlive` is true in the plist, `launchd` restarts a single fresh HWIR after the update script exits. This avoids duplicate HWIR processes (launchd is the only supervisor).

Tip: if you ever disable `KeepAlive` and want the updater to restart HWIR directly, you would need to re-enable the old spawn logic—right now the updater intentionally relies on launchd to restart.
