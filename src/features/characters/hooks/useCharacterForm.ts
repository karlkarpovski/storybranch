// src/features/characters/hooks/useCharacterForm.ts
import { useState, useCallback } from "react";
import type { Character } from "@/types";
import { generateId } from "@/lib/utils";

const DEFAULT_COLORS = [
  "#a855f7", "#3b82f6", "#22c55e",
  "#ef4444", "#f97316", "#ec4899",
];

interface UseCharacterFormOptions {
  initial?: Character | null;
  onSave: (character: Character) => void;
  onClose: () => void;
}

export function useCharacterForm({
  initial,
  onSave,
  onClose,
}: UseCharacterFormOptions) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(
    initial?.description ?? ""
  );
  const [color, setColor] = useState(
    initial?.color ?? DEFAULT_COLORS[0]
  );
  const [error, setError] = useState("");

  const handleSave = useCallback(() => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    const now = new Date().toISOString();
    onSave({
      id: initial?.id ?? generateId(),
      name: name.trim(),
      description: description.trim(),
      color,
      portraitPath: initial?.portraitPath,
      createdAt: initial?.createdAt ?? now,
      updatedAt: now,
    });
    onClose();
  }, [name, description, color, initial, onSave, onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSave();
      if (e.key === "Escape") onClose();
    },
    [handleSave, onClose]
  );

  return {
    name, setName,
    description, setDescription,
    color, setColor,
    error,
    handleSave,
    handleKeyDown,
    colors: DEFAULT_COLORS,
  };
}