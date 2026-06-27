// src/features/edges/hooks/useEdgeLabel.ts
// Manages inline label editing state for an edge.

import { useState, useCallback } from "react";
import { useCanvasStore } from "@/features/canvas/store/canvasStore";

interface UseEdgeLabelOptions {
  edgeId: string;
  initialLabel: string;
}

export function useEdgeLabel({ edgeId, initialLabel }: UseEdgeLabelOptions) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialLabel);
  const updateEdgeLabel = useCanvasStore((s) => s.updateEdgeLabel);

  const startEditing = useCallback(() => {
    setValue(initialLabel);
    setIsEditing(true);
  }, [initialLabel]);

  const save = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed) updateEdgeLabel(edgeId, trimmed);
    else updateEdgeLabel(edgeId, initialLabel); // revert if empty
    setIsEditing(false);
  }, [edgeId, value, initialLabel, updateEdgeLabel]);

  const cancel = useCallback(() => {
    setValue(initialLabel);
    setIsEditing(false);
  }, [initialLabel]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === "Enter") save();
      if (e.key === "Escape") cancel();
    },
    [save, cancel]
  );

  return {
    isEditing,
    value,
    startEditing,
    save,
    cancel,
    handleChange,
    handleKeyDown,
  };
}