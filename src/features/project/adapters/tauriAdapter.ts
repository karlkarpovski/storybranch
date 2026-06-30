// src/features/project/adapters/tauriAdapter.ts
// Tauri implementation — stubbed and ready for when native FS is re-enabled.
// Uses dynamic imports so this file doesn't break browser-only builds.

import type { ProjectFile } from "@/types";
import type { PersistenceAdapter } from "./persistenceAdapter";
import { deserializeProject } from "../utils/serialization";

const AUTOSAVE_FILENAME = "storybranch-autosave.json";

export const tauriAdapter: PersistenceAdapter = {
  async saveAs(project: ProjectFile) {
    try {
      const { save } = await import("@tauri-apps/plugin-dialog");
      const { writeTextFile } = await import("@tauri-apps/plugin-fs");

      const path = await save({
        filters: [{ name: "StoryBranch Project", extensions: ["storybranch"] }],
        defaultPath: `${project.metadata.name}.storybranch`,
      });

      if (!path) return { success: false };

      await writeTextFile(path, JSON.stringify(project, null, 2));
      return { success: true, path };
    } catch (err) {
      console.error("Tauri save failed:", err);
      return { success: false };
    }
  },

  async open() {
    try {
      const { open } = await import("@tauri-apps/plugin-dialog");
      const { readTextFile } = await import("@tauri-apps/plugin-fs");

      const path = await open({
        filters: [{ name: "StoryBranch Project", extensions: ["storybranch", "json"] }],
        multiple: false,
      });

      if (!path || Array.isArray(path)) return null;

      const text = await readTextFile(path);
      return deserializeProject(JSON.parse(text));
    } catch (err) {
      console.error("Tauri open failed:", err);
      return null;
    }
  },

  async autosave(project: ProjectFile) {
    try {
      const { writeTextFile, BaseDirectory } = await import("@tauri-apps/plugin-fs");
      await writeTextFile(AUTOSAVE_FILENAME, JSON.stringify(project), {
        baseDir: BaseDirectory.AppData,
      });
    } catch (err) {
      console.warn("Tauri autosave failed:", err);
    }
  },

  async loadAutosave() {
    try {
      const { readTextFile, exists, BaseDirectory } = await import("@tauri-apps/plugin-fs");
      const fileExists = await exists(AUTOSAVE_FILENAME, {
        baseDir: BaseDirectory.AppData,
      });
      if (!fileExists) return null;

      const text = await readTextFile(AUTOSAVE_FILENAME, {
        baseDir: BaseDirectory.AppData,
      });
      return deserializeProject(JSON.parse(text));
    } catch (err) {
      console.warn("Failed to load Tauri autosave:", err);
      return null;
    }
  },

  async clearAutosave() {
    try {
      const { remove, BaseDirectory } = await import("@tauri-apps/plugin-fs");
      await remove(AUTOSAVE_FILENAME, { baseDir: BaseDirectory.AppData });
    } catch {
      // File may not exist — fine to ignore
    }
  },
};