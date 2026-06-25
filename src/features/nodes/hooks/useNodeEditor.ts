// src/features/nodes/hooks/useNodeEditor.ts
// Manages inline editing state for a single node field.
// Handles: focus, blur-to-save, Escape-to-cancel, Enter-to-confirm.

import { useState, useCallback, useRef } from "react";

interface UseNodeEditorOptions {
  initialValue: string;
  onSave: (value: string) => void;
  onCancel?: () => void;
}

interface UseNodeEditorReturn {
  value: string;
  isEditing: boolean;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  startEditing: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleBlur: () => void;
}

export function useNodeEditor({
  initialValue,
  onSave,
  onCancel,
}: UseNodeEditorOptions): UseNodeEditorReturn {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  // Store the value at the time editing started so we can revert on Escape
  const originalValueRef = useRef(initialValue);

  const startEditing = useCallback(() => {
    originalValueRef.current = initialValue;
    setValue(initialValue);
    setIsEditing(true);
    // Focus after React re-renders the input
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [initialValue]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValue(e.target.value);
    },
    []
  );

  const save = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== originalValueRef.current) {
      onSave(trimmed);
    }
    setIsEditing(false);
  }, [value, onSave]);

  const cancel = useCallback(() => {
    setValue(originalValueRef.current);
    setIsEditing(false);
    onCancel?.();
  }, [onCancel]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // CRITICAL: stop React Flow from intercepting keyboard events
      e.stopPropagation();

      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        save();
      }
      if (e.key === "Escape") {
        cancel();
      }
    },
    [save, cancel]
  );

  const handleBlur = useCallback(() => {
    save();
  }, [save]);

  return {
    value,
    isEditing,
    inputRef,
    startEditing,
    handleChange,
    handleKeyDown,
    handleBlur,
  };
}