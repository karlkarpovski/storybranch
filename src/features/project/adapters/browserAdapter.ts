// src/features/project/adapters/browserAdapter.ts
// Browser implementation: localStorage for autosave, download/upload for explicit save/open.

import type { ProjectFile } from "@/types";
import type { PersistenceAdapter } from "./persistenceAdapter";
import { generateFileName, deserializeProject } from "../utils/serialization";

const AUTOSAVE_KEY = "storybranch:autosave";

export const browserAdapter: PersistenceAdapter = {
  async saveAs(project: ProjectFile) {
    try {
      const json = JSON.stringify(project, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = generateFileName(project.metadata.name);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Revoke after a tick to allow download to start
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      return { success: true, path: a.download };
    } catch (err) {
      console.error("Save failed:", err);
      return { success: false };
    }
  },

  async open() {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".storybranch,.json";

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) {
          resolve(null);
          return;
        }
        try {
          const text = await file.text();
          const raw = JSON.parse(text);
          const project = deserializeProject(raw);
          resolve(project);
        } catch (err) {
          console.error("Failed to open project:", err);
          resolve(null);
        }
      };

      // If user cancels the picker, resolve null after a delay
      input.oncancel = () => resolve(null);

      input.click();
    });
  },

  async autosave(project: ProjectFile) {
    try {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(project));
    } catch (err) {
      // localStorage can throw if quota exceeded — fail silently, not critical
      console.warn("Autosave failed:", err);
    }
  },

  async loadAutosave() {
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY);
      if (!raw) return null;
      return deserializeProject(JSON.parse(raw));
    } catch (err) {
      console.warn("Failed to load autosave:", err);
      return null;
    }
  },

  async clearAutosave() {
    localStorage.removeItem(AUTOSAVE_KEY);
  },
};