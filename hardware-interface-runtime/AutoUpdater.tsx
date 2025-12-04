import { useEffect } from "react";
import { spawn } from "child_process";
import { GitUpdateChecker } from "./utils/GitUpdateChecker";
import { logger } from "./utils/logger";
import { HWIRAppModel } from "./models/HWIRAppModel";

/**
 * Component that periodically checks for git updates and automatically restarts
 * the application when updates are available.
 */
export const AutoUpdater = ({
  app,
  checkIntervalMs = 1 * 60 * 1000, // 1 minute default
}: {
  app: HWIRAppModel;
  checkIntervalMs?: number;
}) => {
  const projectId = app.project?._id;
  const playlistId = app.playlist?._id;

  useEffect(() => {
    if (!projectId) return;

    logger.info(
      `Auto-updater enabled. Checking for updates every ${checkIntervalMs / 1000}s`,
    );

    let isChecking = false;
    const checker = new GitUpdateChecker();

    const checkAndUpdate = async () => {
      if (isChecking) {
        logger.info("Update check already in progress, skipping");
        return;
      }

      isChecking = true;

      try {
        const isGitRepo = await checker.isGitRepository();
        if (!isGitRepo) {
          logger.warn("Not in a git repository, skipping update check");
          return;
        }

        logger.info("Checking for updates...");
        const result = await checker.checkForUpdates();

        if (result.error) {
          logger.error("Update check failed:", result.error);
          return;
        }

        if (!result.hasUpdate) return;

        // Update available, check if safe to update
        const isClean = await checker.isWorkingDirectoryClean();
        if (!isClean) {
          logger.warn(
            "Working directory has uncommitted changes, skipping auto-update",
          );
          return;
        }

        // Trigger update
        logger.success("Update available and safe to apply!");
        triggerUpdate();
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        logger.error("Error during update check:", errorMsg);
      } finally {
        isChecking = false;
      }
    };

    const triggerUpdate = () => {
      logger.info("========================================");
      logger.info("STARTING AUTO-UPDATE PROCESS");
      logger.info("========================================");

      const updateScript = "hardware-interface-runtime/updateAndRestart.ts";
      const isWindows = process.platform === "win32";

      // Pass current settings to update script so it can restart with same config
      const scriptArgs = [
        updateScript,
        "--project",
        projectId,
        "--playlist",
        playlistId ?? "null",
      ];

      logger.info(`Spawning update script with args: ${scriptArgs.join(" ")}`);
      logger.info(`Platform: ${process.platform}`);

      if (isWindows) {
        // On Windows, use 'start' to create a truly detached process
        const startArgs = ["/c", "start", '""', "bun", ...scriptArgs];
        logger.info(`Windows spawn: cmd ${startArgs.join(" ")}`);

        const child = spawn("cmd", startArgs, {
          detached: true,
          stdio: "ignore",
          windowsHide: false,
        });
        child.unref();
      } else {
        const child = spawn("bun", scriptArgs, {
          detached: true,
          stdio: "ignore",
        });
        child.unref();
      }

      logger.info("Update script spawned, shutting down in 2 seconds...");

      setTimeout(() => {
        logger.info("Goodbye! Update script will restart us...");
        process.exit(0);
      }, 2000);
    };

    // Initial check after 10 seconds
    const initialTimer = setTimeout(checkAndUpdate, 10_000);

    // Periodic checks
    const interval = setInterval(checkAndUpdate, checkIntervalMs);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [checkIntervalMs, projectId, playlistId]);

  return null;
};
