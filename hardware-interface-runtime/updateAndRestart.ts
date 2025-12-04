#!/usr/bin/env bun
/**
 * Update and restart script
 * This script is spawned as a detached process when an update is detected.
 * It waits for the parent to exit, pulls updates, installs dependencies, and restarts.
 */

import { spawn } from "child_process";
import { promisify } from "util";
import { exec } from "child_process";

const execAsync = promisify(exec);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const timestamp = () => new Date().toISOString();
const log = (message: string, ...args: unknown[]) => {
  console.log(`[${timestamp()}] [UPDATER]`, message, ...args);
};

async function main() {
  log("Update and restart script started");

  try {
    // Wait for parent process to exit
    log("Waiting 2 seconds for parent process to exit...");
    await sleep(2000);

    // Pull updates from git
    log("Pulling updates from git...");
    try {
      const { stdout: pullOutput, stderr: pullError } =
        await execAsync("git pull");
      log("Git pull output:", pullOutput);
      if (pullError) log("Git pull stderr:", pullError);
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
      log("Bun install output:", installOutput);
      if (installError) log("Bun install stderr:", installError);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      log("ERROR: Bun install failed:", errorMsg);
      log("Attempting to restart anyway...");
    }

    // Wait a moment before restart
    log("Waiting 1 second before restart...");
    await sleep(1000);

    // Restart the application
    log("Restarting application with 'bun run hwir'...");

    // Spawn the new process detached so this script can exit
    const child = spawn("bun", ["run", "hwir"], {
      detached: true,
      stdio: "inherit",
      shell: true,
    });

    // Unref so this script can exit
    child.unref();

    log("Application restarted successfully. Update script exiting.");
    process.exit(0);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    log("FATAL ERROR during update:", errorMsg);
    log("Update failed. Please restart manually.");
    process.exit(1);
  }
}

main();
