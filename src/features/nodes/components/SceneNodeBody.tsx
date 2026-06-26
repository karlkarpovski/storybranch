// src/features/nodes/components/SceneNodeBody.tsx
// The expandable body of a scene node.
// Contains: description textarea, character tags, dialogue preview.

import { useRef } from "react";
import { useNodeEditor } from "../hooks/useNodeEditor";
import { useStore } from "@/store";
import type { SceneNodeData, DialogueLine } from "@/types";
import { cn } from "@/lib/utils";
import { MessageSquare, User } from "lucide-react";

interface SceneNodeBodyProps {
  nodeId: string;
  data: SceneNodeData;
  onUpdate: (updates: Partial<SceneNodeData>) => void;
}

// ─── Description field ────────────────────────────────────────────────────────

function DescriptionField({
  description,
  onSave,
}: {
  description: string;
  onSave: (value: string) => void;
}) {
  const {
    value,
    isEditing,
    inputRef,      // ← not used here
    textareaRef,   // ← use this one
    startEditing,
    handleChange,
    handleKeyDown,
    handleBlur,
  } = useNodeEditor({ initialValue: description, onSave });

  return (
    <div className="px-2.5 pb-2">
      {isEditing ? (
        // Update the textarea element — no cast needed:
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          rows={3}
          placeholder="Scene description..."
          className={cn(
            "w-full bg-transparent text-xs text-foreground",
            "outline-none resize-none",
            "border border-border rounded-md p-1.5",
            "placeholder:text-muted-foreground/50",
            "focus:border-primary/50"
          )}
          onMouseDown={(e) => e.stopPropagation()}
        />
      ) : (
        <p
          onClick={startEditing}
          className={cn(
            "text-xs text-muted-foreground cursor-text",
            "line-clamp-3 leading-relaxed",
            "hover:text-foreground transition-colors",
            "min-h-[2rem]",
            !description && "italic text-muted-foreground/50"
          )}
        >
          {description || "Click to add description..."}
        </p>
      )}
    </div>
  );
}

// ─── Character tags ───────────────────────────────────────────────────────────

function CharacterTags({ characterIds }: { characterIds: string[] }) {
  const characters = useStore((s) => s.characters);

  if (characterIds.length === 0) return null;

  return (
    <div className="px-2.5 pb-2">
      <div className="flex items-center gap-1 mb-1">
        <User size={10} className="text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
          Characters
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {characterIds.map((id) => {
          const char = characters[id];
          if (!char) return null;
          return (
            <span
              key={id}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium"
              style={{
                backgroundColor: char.color + "33", // 20% opacity
                color: char.color,
                border: `1px solid ${char.color}55`,
              }}
            >
              {char.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─── Dialogue preview ─────────────────────────────────────────────────────────

function DialoguePreview({ dialogues }: { dialogues: DialogueLine[] }) {
  const characters = useStore((s) => s.characters);

  if (dialogues.length === 0) return null;

  // Show first 2 dialogue lines as preview
  const preview = dialogues.slice(0, 2);

  return (
    <div className="px-2.5 pb-2">
      <div className="flex items-center gap-1 mb-1">
        <MessageSquare size={10} className="text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
          Dialogue
        </span>
      </div>
      <div className="space-y-1">
        {preview.map((line) => {
          const char = line.characterId
            ? characters[line.characterId]
            : null;
          return (
            <div key={line.id} className="text-[10px] leading-relaxed">
              {char && (
                <span
                  className="font-semibold mr-1"
                  style={{ color: char.color }}
                >
                  {char.name}:
                </span>
              )}
              <span className="text-muted-foreground line-clamp-1">
                {line.text}
              </span>
            </div>
          );
        })}
        {dialogues.length > 2 && (
          <p className="text-[10px] text-muted-foreground/50 italic">
            +{dialogues.length - 2} more lines...
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main body ────────────────────────────────────────────────────────────────

export function SceneNodeBody({ nodeId, data, onUpdate }: SceneNodeBodyProps) {
  return (
    <div
      className="flex flex-col"
      // Stop React Flow drag from starting inside the body
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Divider */}
      <div className="h-px bg-border mx-2.5 mb-2" />

      <DescriptionField
        description={data.description}
        onSave={(description) => onUpdate({ description })}
      />

      <CharacterTags characterIds={data.characterIds} />

      <DialoguePreview dialogues={data.dialogues} />

      {/* Tag pills */}
      {data.tags.length > 0 && (
        <div className="px-2.5 pb-2 flex flex-wrap gap-1">
          {data.tags.map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}