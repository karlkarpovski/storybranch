// src/features/characters/components/CharacterForm.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { useCharacterForm } from "../hooks/useCharacterForm";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";
import type { Character } from "@/types";
import { X } from "lucide-react";

interface CharacterFormProps {
  open: boolean;
  onClose: () => void;
  initial?: Character | null;
}

export function CharacterForm({ open, onClose, initial }: CharacterFormProps) {
  const addCharacter = useStore((s) => s.addCharacter);
  const updateCharacter = useStore((s) => s.updateCharacter);

  const {
    name, setName,
    description, setDescription,
    color, setColor,
    error,
    handleSave,
    handleKeyDown,
    colors,
  } = useCharacterForm({
    initial,
    onSave: (character: Character) => {
      if (initial) updateCharacter(character.id, character);
      else addCharacter(character);
    },
    onClose,
  });

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-black/60 animate-fade-in"
        />
        <Dialog.Content
          className={cn(
            "fixed z-50 top-1/2 left-1/2",
            "-translate-x-1/2 -translate-y-1/2",
            "w-full max-w-sm p-5 rounded-xl",
            "bg-card border border-border shadow-2xl",
            "animate-fade-in"
          )}
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-sm font-semibold text-foreground">
              {initial ? "Edit Character" : "New Character"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-accent"
                onClick={onClose}
              >
                <X size={14} />
              </button>
            </Dialog.Close>
          </div>

          {/* Name */}
          <div className="mb-3">
            <label className="block text-xs text-muted-foreground mb-1">
              Name *
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Character name..."
              className={cn(
                "w-full px-3 py-2 rounded-md text-sm",
                "bg-muted border border-border",
                "text-foreground placeholder:text-muted-foreground",
                "outline-none focus:border-primary",
                "transition-colors"
              )}
            />
            {error && (
              <p className="text-xs text-destructive mt-1">{error}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="block text-xs text-muted-foreground mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief character description..."
              rows={3}
              className={cn(
                "w-full px-3 py-2 rounded-md text-sm resize-none",
                "bg-muted border border-border",
                "text-foreground placeholder:text-muted-foreground",
                "outline-none focus:border-primary",
                "transition-colors"
              )}
            />
          </div>

          {/* Color */}
          <div className="mb-5">
            <label className="block text-xs text-muted-foreground mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    "w-7 h-7 rounded-full transition-transform",
                    "hover:scale-110",
                    color === c && "ring-2 ring-white ring-offset-2 ring-offset-card scale-110"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm",
                "text-muted-foreground hover:text-foreground",
                "hover:bg-accent transition-colors"
              )}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 transition-colors"
              )}
            >
              {initial ? "Save Changes" : "Create"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}