// src/features/canvas/store/historyStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { CanvasNode, ChoiceEdge } from "./canvasStore";

export interface CanvasSnapshot {
  nodes: CanvasNode[];
  edges: ChoiceEdge[];
  timestamp: number;
  label: string;
}

interface HistoryState {
  past: CanvasSnapshot[];
  future: CanvasSnapshot[];
  maxHistory: number;
}

interface HistoryActions {
  pushSnapshot: (snapshot: CanvasSnapshot) => void;
  undo: (currentNodes: CanvasNode[], currentEdges: ChoiceEdge[]) => CanvasSnapshot | null;
  redo: () => CanvasSnapshot | null;
  clearHistory: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

type HistoryStore = HistoryState & HistoryActions;

export const useHistoryStore = create<HistoryStore>()(
  devtools(
    (set, get) => ({
      past: [],
      future: [],
      maxHistory: 100,

      pushSnapshot: (snapshot) => {
        const { past, maxHistory } = get();
        const trimmed =
          past.length >= maxHistory
            ? past.slice(past.length - maxHistory + 1)
            : past;
        set({
          past: [...trimmed, snapshot],
          future: [],
        });
      },

      undo: (currentNodes, currentEdges) => {
        const { past, future } = get();
        if (past.length === 0) return null;

        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

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

        const next = future[0];
        const newFuture = future.slice(1);

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