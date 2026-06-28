// src/features/notes/components/NoteNode.tsx
import { useState, useCallback } from "react";
import { type NodeProps, type Node } from "@xyflow/react";
import { useCanvasStore } from "@/features/canvas/store/canvasStore";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import type { NoteNodeData } from "@/types";

export type NoteNode = Node<NoteNodeData>;

const NOTE_COLORS = [
  { bg: "#fef08a", text: "#713f12" },
  { bg: "#bbf7d0", text: "#14532d" },
  { bg: "#bfdbfe", text: "#1e3a5f" },
  { bg: "#fecaca", text: "#7f1d1d" },
  { bg: "#e9d5ff", text: "#4c1d95" },
];

export function NoteNode({ id, data, selected }: NodeProps<NoteNode>) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.content);
  const deleteNode = useCanvasStore((s) => s.deleteNode);
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);

  const colorScheme =
    NOTE_COLORS.find((c) => c.bg === data.color) ?? NOTE_COLORS[0];

  const handleSave = useCallback(() => {
    updateNodeData(id, { content } as never);
    setIsEditing(false);
  }, [id, content, updateNodeData]);

  return (
    <div
      style={{
        backgroundColor: colorScheme.bg,
        color: colorScheme.text,
        width: 200,
        minHeight: 120,
      }}
      className={cn(
        "group rounded-lg shadow-lg p-3 relative",
        "border-2 transition-all",
        selected ? "border-primary/60" : "border-transparent"
      )}
    >
      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteNode(id);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className={cn(
          "absolute top-1.5 right-1.5",
          "w-5 h-5 rounded flex items-center justify-center",
          "opacity-0 group-hover:opacity-100",
          "hover:bg-black/10 transition-all"
        )}
      >
        <X size={11} />
      </button>

      {/* Color picker row */}
      <div
        className="flex gap-1 mb-2 noDrag"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {NOTE_COLORS.map((c) => (
          <button
            key={c.bg}
            onClick={() => updateNodeData(id, { color: c.bg } as never)}
            className={cn(
              "w-3.5 h-3.5 rounded-full border transition-transform hover:scale-110",
              data.color === c.bg
                ? "border-gray-600 scale-110"
                : "border-transparent"
            )}
            style={{ backgroundColor: c.bg }}
          />
        ))}
      </div>

      {/* Content */}
      {isEditing ? (
        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Escape") handleSave();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-full bg-transparent text-sm resize-none outline-none"
          style={{ color: colorScheme.text, minHeight: 80 }}
          placeholder="Write a note..."
        />
      ) : (
        <p
          className="text-sm whitespace-pre-wrap cursor-text noDrag"
          style={{ color: colorScheme.text, minHeight: 80 }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {data.content || (
            <span style={{ opacity: 0.5 }}>Double-click to write...</span>
          )}
        </p>
      )}
    </div>
  );
}