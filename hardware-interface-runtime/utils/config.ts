import { existsSync, readFileSync, writeFileSync } from "fs";
import { Id } from "../../convex/_generated/dataModel";
import { logger } from "./logger";

const CONFIG_FILE = ".hwir-config.json";

export interface HWIRConfig {
  projectId: Id<"projects">;
  playlistId: Id<"playlists"> | null;
}

/**
 * Load saved config from disk
 */
export const loadConfig = (): HWIRConfig | null => {
  try {
    if (!existsSync(CONFIG_FILE)) return null;

    const raw = readFileSync(CONFIG_FILE, "utf-8");
    const config = JSON.parse(raw) as HWIRConfig;

    if (!config.projectId) return null;

    logger.info(
      `Loaded config: project=${config.projectId}, playlist=${config.playlistId ?? "none"}`,
    );
    return config;
  } catch (error) {
    logger.warn("Failed to load config file:", error);
    return null;
  }
};

/**
 * Save config to disk
 */
export const saveConfig = (config: HWIRConfig): void => {
  try {
    writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    logger.info("Config saved to", CONFIG_FILE);
  } catch (error) {
    logger.error("Failed to save config:", error);
  }
};

/**
 * Get current config for passing to update script
 */
export const getCurrentConfig = (): HWIRConfig | null => loadConfig();
