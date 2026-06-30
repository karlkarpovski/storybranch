// src/features/project/hooks/useAutosave.ts
// Autosaves every 30 seconds when the project is dirty.

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/store";
import { useCanvasStore } from "@/features/canvas/store/canvasStore";
import { persistence } from "../adapters";
import { serializeProject } from "../utils/serialization";

const AUTOSAVE_INTERVAL_MS = 30_000;

export type AutosaveStatus = "idle" | "saving" | "saved" | "error";

export function useAutosave() {
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const isDirty = useStore((s) => s.isDirty);
  const metadata = useStore((s) => s.metadata);
  const markClean = useStore((s) => s.markClean);
  const characters = useStore((s) => s.characters);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      const dirty = useStore.getState().isDirty;
      const meta = useStore.getState().metadata;
      if (!dirty || !meta) return;

      setStatus("saving");
      try {
        const { nodes, edges } = useCanvasStore.getState();
        const chars = useStore.getState().characters;
        const project = serializeProject(meta, nodes, edges, chars);
        await persistence.autosave(project);
        markClean();
        setStatus("saved");
        // Reset to idle after showing "saved" briefly
        setTimeout(() => setStatus("idle"), 2000);
      } catch (err) {
        console.error("Autosave error:", err);
        setStatus("error");
      }
    }, AUTOSAVE_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [markClean]);

  return { status };
}