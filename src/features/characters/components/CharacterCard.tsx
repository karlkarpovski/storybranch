// src/features/characters/components/CharacterCard.tsx
import { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import type { Character } from "@/types";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

interface CharacterCardProps {
  character: Character;
  onEdit: (character: Character) => void;
}

export function CharacterCard({ character, onEdit }: CharacterCardProps) {
  const deleteCharacter = useStore((s) => s.deleteCharacter);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <div
        className={cn(
          "group flex items-center gap-3 p-2.5 rounded-lg",
          "border border-border hover:border-primary/30",
          "bg-card hover:bg-accent/30 transition-all"
        )}
      >
        {/* Color avatar */}
        <div
          className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: character.color }}
        >
          {character.name.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {character.name}
          </p>
          {character.description && (
            <p className="text-xs text-muted-foreground truncate">
              {character.description}
            </p>
          )}
        </div>

        {/* Actions — visible on hover */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(character)}
            className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Delete confirmation */}
      <AlertDialog.Root open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
          <AlertDialog.Content
            className={cn(
              "fixed z-50 top-1/2 left-1/2",
              "-translate-x-1/2 -translate-y-1/2",
              "w-full max-w-sm p-5 rounded-xl",
              "bg-card border border-border shadow-2xl"
            )}
          >
            <AlertDialog.Title className="text-sm font-semibold text-foreground mb-2">
              Delete Character
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm text-muted-foreground mb-4">
              Delete <strong className="text-foreground">{character.name}</strong>?
              This won't remove them from existing scenes.
            </AlertDialog.Description>
            <div className="flex gap-2 justify-end">
              <AlertDialog.Cancel asChild>
                <button className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  onClick={() => deleteCharacter(character.id)}
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                >
                  Delete
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
}