// src/features/canvas/store/historyStore.ts
// Manages the undo/redo history stack for canvas state.
// Stores snapshots of nodes + edges at each meaningful action.

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { SceneNode, ChoiceEdge } from "./canvasStore";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CanvasSnapshot {
  nodes: SceneNode[];
  edges: ChoiceEdge[];
  timestamp: number;
  label: string; // human-readable action name e.g. "Add Node", "Delete Edge"
}

interface HistoryState {
  past: CanvasSnapshot[];
  future: CanvasSnapshot[];
  maxHistory: number;
}

interface HistoryActions {
  pushSnapshot: (snapshot: CanvasSnapshot) => void;
  undo: (currentNodes: SceneNode[], currentEdges: ChoiceEdge[]) => CanvasSnapshot | null;
  redo: () => CanvasSnapshot | null;
  clearHistory: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

type HistoryStore = HistoryState & HistoryActions;

// ─── Store ────────────────────────────────────────────────────────────────────

export const useHistoryStore = create<HistoryStore>()(
  devtools(
    (set, get) => ({
      past: [],
      future: [],
      maxHistory: 100,

      pushSnapshot: (snapshot) => {
        const { past, maxHistory } = get();
        const trimmed = past.length >= maxHistory
          ? past.slice(past.length - maxHistory + 1)
          : past;

        set({
          past: [...trimmed, snapshot],
          // Clear future whenever a new action is taken
          future: [],
        });
      },

      undo: (currentNodes, currentEdges) => {
        const { past, future } = get();
        if (past.length === 0) return null;

        // Pop the last snapshot from past
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        // Push current state to future so we can redo
        set({
          past: newPast,
          future: [
            {
              nodes: currentNodes,
              edges: currentEdges,
              timestamp: Date.now(),
              label: "Current",
            },
            ...future,
          ],
        });

        return previous;
      },

      redo: () => {
        const { past, future } = get();
        if (future.length === 0) return null;

        // Pop the first snapshot from future
        const next = future[0];
        const newFuture = future.slice(1);

        // Push current future head to past
        set({
          past: [...past, next],
          future: newFuture,
        });

        return next;
      },

      clearHistory: () => set({ past: [], future: [] }),

      canUndo: () => get().past.length > 0,
      canRedo: () => get().future.length > 0,
    }),
    { name: "StoryBranch:History" }
  )
);