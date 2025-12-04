#!/usr/bin/env bun
/**
 * Update and restart script
 * This script is spawned as a detached process when an update is detected.
 * It waits for the parent to exit, pulls updates, installs dependencies, and restarts.
 *
 * Usage: bun updateAndRestart.ts --project <projectId> --playlist <playlistId>
 */

import { spawn } from "child_process";
import { promisify } from "util";
import { exec } from "child_process";
import { Command } from "commander";
import { appendFileSync } from "fs";

const execAsync = promisify(exec);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const LOG_FILE = "hwir-debug.log";

const timestamp = () => new Date().toISOString();
const log = (message: string, ...args: unknown[]) => {
  const argsStr = args.length > 0 ? " " + args.map(String).join(" ") : "";
  const line = `[${timestamp()}] [UPDATER] ${message}${argsStr}`;
  console.log(line);
  try {
    appendFileSync(LOG_FILE, line + "\n");
  } catch {
    // ignore
  }
};

async function main() {
  log("========================================");
  log("Update and restart script started");
  log("========================================");

  // Parse args passed from AutoUpdater
  const program = new Command();
  program
    .option("-p, --project <id>", "Project ID")
    .option("-l, --playlist <id>", "Playlist ID")
    .parse(process.argv);

  const options = program.opts();
  const projectId = options.project;
  const playlistId = options.playlist;

  log(`Settings to restore: project=${projectId}, playlist=${playlistId}`);
  log(`Platform: ${process.platform}`);

  try {
    // Wait for parent process to exit
    log("Waiting 3 seconds for parent process to exit...");
    await sleep(3000);

    // Pull updates from git
    log("Pulling updates from git...");
    try {
      const { stdout: pullOutput, stderr: pullError } =
        await execAsync("git pull");
      log("Git pull output:", pullOutput.trim());
      if (pullError) log("Git pull stderr:", pullError.trim());
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      log("ERROR: Git pull failed:", errorMsg);
      log("Attempting to continue anyway...");
    }

    // Install dependencies
    log("Installing dependencies with bun...");
    try {
      const { stdout: installOutput, stderr: installError } =
        await execAsync("bun install");
      log("Bun install output:", installOutput.trim());
      if (installError) log("Bun install stderr:", installError.trim());
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      log("ERROR: Bun install failed:", errorMsg);
      log("Attempting to restart anyway...");
    }

    // Wait a moment before restart
    log("Waiting 2 seconds before restart...");
    await sleep(2000);

    // Build the restart command with the saved settings
    const hwirArgs: string[] = [];
    if (projectId) {
      hwirArgs.push("-p", projectId);
      if (playlistId) hwirArgs.push("-l", playlistId);
    }

    log(`Restarting with args: ${hwirArgs.join(" ") || "(none)"}`);

    // On Windows, use 'start' command to truly detach the process
    // On Unix, use standard detached spawn
    const isWindows = process.platform === "win32";

    if (isWindows) {
      // Use 'start' to create a new window that persists
      const startArgs = [
        "/c",
        "start",
        '""', // Empty title (required by start)
        "bun",
        "run",
        "hwir",
        ...hwirArgs,
      ];
      log(`Windows spawn: cmd ${startArgs.join(" ")}`);

      const child = spawn("cmd", startArgs, {
        detached: true,
        stdio: "ignore",
        windowsHide: false,
      });
      child.unref();
    } else {
      const child = spawn("bun", ["run", "hwir", ...hwirArgs], {
        detached: true,
        stdio: "ignore",
      });
      child.unref();
    }

    log("Application restart initiated!");
    log("Update script complete. Exiting in 2 seconds...");

    // Give time for the spawn to complete before exiting
    await sleep(2000);

    log("Goodbye!");
    process.exit(0);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    log("FATAL ERROR during update:", errorMsg);
    log("Update failed. Please restart manually with: bun run hwir");
    // Don't exit immediately so the error can be seen
    await sleep(5000);
    process.exit(1);
  }
}

main();
