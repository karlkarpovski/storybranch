// src/features/canvas/components/PlaceholderChoiceEdge.tsx
// A minimal edge for Phase 2.
// Phase 4 replaces this with the full ChoiceEdge component.

import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import type { ChoiceEdge } from "../store/canvasStore";
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
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeColor = data?.color ?? "#a855f7";

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

      {/* Choice label */}
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-medium",
              "border border-border bg-card text-foreground",
              "shadow-sm nodrag nopan",
              selected && "border-primary text-primary"
            )}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}