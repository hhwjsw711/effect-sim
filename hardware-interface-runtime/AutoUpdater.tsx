import { useEffect } from "react";
import { spawn } from "child_process";
import { GitUpdateChecker } from "./utils/GitUpdateChecker";
import { logger } from "./utils/logger";

interface AutoUpdaterProps {
  checkIntervalMs?: number;
}

/**
 * Component that periodically checks for git updates and automatically restarts
 * the application when updates are available.
 */
export const AutoUpdater = ({
  checkIntervalMs = 1 * 60 * 1000, // 1 minute default
}: AutoUpdaterProps) => {
  useEffect(() => {
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

      const child = spawn("bun", [updateScript], {
        detached: true,
        stdio: ["ignore", "inherit", "inherit"],
        shell: true,
      });

      child.unref();

      logger.info("Update script spawned, shutting down...");

      setTimeout(() => {
        logger.info("Goodbye! Restarting...");
        process.exit(0);
      }, 1000);
    };

    // Initial check after 10 seconds
    const initialTimer = setTimeout(checkAndUpdate, 10_000);

    // Periodic checks
    const interval = setInterval(checkAndUpdate, checkIntervalMs);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [checkIntervalMs]);

  return null;
};
