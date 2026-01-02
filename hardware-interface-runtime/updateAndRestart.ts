#!/usr/bin/env bun
/**
 * Update script invoked by the auto-updater. It waits for the parent to exit,
 * applies updates (git pull + bun install), then exits so launchd can restart
 * the single HWIR instance.
 *
 * Usage: bun updateAndRestart.ts --project <projectId> --playlist <playlistId>
 */

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

    // Wait a moment before exit
    log("Waiting 2 seconds before exit...");
    await sleep(2000);

    log("Update complete. Exiting so supervisor can restart the process...");
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
