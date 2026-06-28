// src/hooks/useUndoRedo.ts
import { useEffect, useCallback } from "react";
import { useHistoryStore } from "@/features/canvas/store/historyStore";
import { useCanvasStore } from "@/features/canvas/store/canvasStore";

export function useUndoRedo() {
  const canUndo = useHistoryStore((s) => s.canUndo);
  const canRedo = useHistoryStore((s) => s.canRedo);
  const undo = useHistoryStore((s) => s.undo);
  const redo = useHistoryStore((s) => s.redo);
  const restoreSnapshot = useCanvasStore((s) => s.restoreSnapshot);

  const handleUndo = useCallback(() => {
    // No cast needed — historyStore now uses CanvasNode[]
    const { nodes, edges } = useCanvasStore.getState();
    const snapshot = undo(nodes, edges);
    if (snapshot) restoreSnapshot(snapshot.nodes, snapshot.edges);
  }, [undo, restoreSnapshot]);

  const handleRedo = useCallback(() => {
    const snapshot = redo();
    if (snapshot) restoreSnapshot(snapshot.nodes, snapshot.edges);
  }, [redo, restoreSnapshot]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      const ctrl = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      const isUndo = ctrl && key === "z" && !e.shiftKey;
      const isRedo = ctrl && (key === "y" || (key === "z" && e.shiftKey));

      if (isUndo) {
        e.preventDefault();
        e.stopImmediatePropagation();
        handleUndo();
      }
      if (isRedo) {
        e.preventDefault();
        e.stopImmediatePropagation();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [handleUndo, handleRedo]);

  return {
    canUndo: canUndo(),
    canRedo: canRedo(),
    undo: handleUndo,
    redo: handleRedo,
  };
}