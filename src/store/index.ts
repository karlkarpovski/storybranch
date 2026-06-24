// src/store/index.ts
// Root Zustand store.
// In later phases, this will grow with canvas, node, character, and project slices.
// We use Immer middleware for ergonomic state mutations.

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import type {
  Character,
  ProjectMetadata,
  SidebarPanel,
  Theme,
} from "@/types";

// ─── UI Slice ─────────────────────────────────────────────────────────────────

interface UIState {
  theme: Theme;
  activeSidebarPanel: SidebarPanel;
  isSidebarOpen: boolean;
}

interface UIActions {
  setTheme: (theme: Theme) => void;
  setActiveSidebarPanel: (panel: SidebarPanel) => void;
  toggleSidebar: () => void;
}

// ─── Project Slice ────────────────────────────────────────────────────────────

interface ProjectState {
  metadata: ProjectMetadata | null;
  isDirty: boolean;        // unsaved changes exist
  isLoading: boolean;
}

interface ProjectActions {
  setProjectMetadata: (metadata: ProjectMetadata) => void;
  markDirty: () => void;
  markClean: () => void;
}

// ─── Character Slice (scaffold — expanded in Phase 6) ─────────────────────────

interface CharacterState {
  characters: Record<string, Character>; // indexed by id for O(1) lookup
}

interface CharacterActions {
  addCharacter: (character: Character) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
}

// ─── Combined Store ───────────────────────────────────────────────────────────

type StoreState = UIState &
  UIActions &
  ProjectState &
  ProjectActions &
  CharacterState &
  CharacterActions;

export const useStore = create<StoreState>()(
  devtools(
    immer((set) => ({
      // ── UI ──────────────────────────────────────────────────────────────────
      theme: "dark",
      activeSidebarPanel: null,
      isSidebarOpen: true,

      setTheme: (theme) =>
        set((state) => {
          state.theme = theme;
        }),

      setActiveSidebarPanel: (panel) =>
        set((state) => {
          // Toggle off if same panel clicked
          state.activeSidebarPanel =
            state.activeSidebarPanel === panel ? null : panel;
          state.isSidebarOpen = panel !== null;
        }),

      toggleSidebar: () =>
        set((state) => {
          state.isSidebarOpen = !state.isSidebarOpen;
        }),

      // ── Project ─────────────────────────────────────────────────────────────
      metadata: null,
      isDirty: false,
      isLoading: false,

      setProjectMetadata: (metadata) =>
        set((state) => {
          state.metadata = metadata;
        }),

      markDirty: () =>
        set((state) => {
          state.isDirty = true;
        }),

      markClean: () =>
        set((state) => {
          state.isDirty = false;
        }),

      // ── Characters ──────────────────────────────────────────────────────────
      characters: {},

      addCharacter: (character) =>
        set((state) => {
          state.characters[character.id] = character;
        }),

      updateCharacter: (id, updates) =>
        set((state) => {
          if (state.characters[id]) {
            Object.assign(state.characters[id], updates);
          }
        }),

      deleteCharacter: (id) =>
        set((state) => {
          delete state.characters[id];
        }),
    })),
    { name: "StoryBranch" }
  )
);