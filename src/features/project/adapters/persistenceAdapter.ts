// src/features/project/adapters/persistenceAdapter.ts
// Common interface for save/load — implementation swapped by environment.

import type { ProjectFile } from "@/types";

export interface PersistenceAdapter {
  /** Explicit save — triggers download (browser) or native save dialog (Tauri) */
  saveAs: (project: ProjectFile) => Promise<{ success: boolean; path?: string }>;
  /** Explicit open — triggers file picker (browser) or native open dialog (Tauri) */
  open: () => Promise<ProjectFile | null>;
  /** Silent autosave — writes to local storage / app data dir */
  autosave: (project: ProjectFile) => Promise<void>;
  /** Load the most recent autosave, if any */
  loadAutosave: () => Promise<ProjectFile | null>;
  /** Clear autosave (called after explicit save succeeds) */
  clearAutosave: () => Promise<void>;
}

// Runtime detection — Tauri injects this global when running natively
export function isTauriEnvironment(): boolean {
  return typeof window !== "undefined" && "__TAURI__" in window;
}