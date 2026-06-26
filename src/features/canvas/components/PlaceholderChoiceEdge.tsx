// src/features/canvas/components/PlaceholderChoiceEdge.tsx
import { useState, useCallback } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import type { ChoiceEdge } from "../store/canvasStore";
import { useCanvasStore } from "../store/canvasStore";
import { cn } from "@/lib/utils";

export function PlaceholderChoiceEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps<ChoiceEdge>) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(data?.label ?? "");

  const updateEdgeLabel = useCanvasStore((s) => s.updateEdgeLabel);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeColor = data?.color ?? "#a855f7";

  const handleSave = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed) updateEdgeLabel(id, trimmed);
    setIsEditing(false);
  }, [id, value, updateEdgeLabel]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === "Enter") handleSave();
      if (e.key === "Escape") {
        setValue(data?.label ?? "");
        setIsEditing(false);
      }
    },
    [handleSave, data?.label]
  );

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected ? "#a855f7" : edgeColor,
          strokeWidth: selected ? 2.5 : 1.5,
          opacity: selected ? 1 : 0.7,
          transition: "stroke 0.15s, stroke-width 0.15s",
        }}
        markerEnd="url(#arrowhead)"
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          {isEditing ? (
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              onMouseDown={(e) => e.stopPropagation()}
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                "border border-primary bg-card text-foreground",
                "outline-none shadow-sm",
                "min-w-[60px] max-w-[160px]"
              )}
              style={{ width: `${Math.max(value.length * 8, 60)}px` }}
            />
          ) : (
            <div
              onDoubleClick={(e) => {
                e.stopPropagation();
                setValue(data?.label ?? "");
                setIsEditing(true);
              }}
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                "border border-border bg-card text-foreground",
                "shadow-sm cursor-text select-none",
                "hover:border-primary hover:text-primary",
                "transition-colors",
                selected && "border-primary text-primary"
              )}
              title="Double-click to edit"
            >
              {data?.label || "Choice"}
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}