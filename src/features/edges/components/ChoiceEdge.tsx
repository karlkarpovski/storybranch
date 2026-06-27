// src/features/edges/components/ChoiceEdge.tsx
// Full choice edge component with:
// - Inline editable label
// - Color matching source node
// - Animated flow option
// - Delete button on hover
// - Bezier / straight / step path types

import { useState, useMemo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  getStraightPath,
  getSmoothStepPath,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react";
import type { ChoiceEdge as ChoiceEdgeFlow } from "@/features/canvas/store/canvasStore";
import { useCanvasStore } from "@/features/canvas/store/canvasStore";
import { useEdgeLabel } from "../hooks/useEdgeLabel";
import { EdgeDeleteButton } from "./EdgeDeleteButton";
import { cn } from "@/lib/utils";
import { DEFAULT_EDGE_COLOR } from "../constants";

export function ChoiceEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  source,
}: EdgeProps<ChoiceEdgeFlow>) {
  const [isHovered, setIsHovered] = useState(false);
  const { getNode } = useReactFlow();

  // ── Derive edge color from source node ──────────────────────────────────
  const edgeColor = useMemo(() => {
    const sourceNode = getNode(source);
    if (sourceNode?.data?.color) {
      return sourceNode.data.color as string;
    }
    return data?.color ?? DEFAULT_EDGE_COLOR;
  }, [source, getNode, data?.color]);

  // ── Path calculation based on edge type ─────────────────────────────────
  const edgeType = data?.edgeType ?? "bezier";

  const [edgePath, labelX, labelY] = useMemo(() => {
    const params = {
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    };
    if (edgeType === "straight") return getStraightPath(params);
    if (edgeType === "step") return getSmoothStepPath({ ...params, borderRadius: 8 });
    return getBezierPath(params);
  }, [edgeType, sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition]);

  // ── Label editing ────────────────────────────────────────────────────────
  const {
    isEditing,
    value,
    startEditing,
    save,
    handleChange,
    handleKeyDown,
  } = useEdgeLabel({ edgeId: id, initialLabel: data?.label ?? "Choice" });

  // ── Animated toggle ──────────────────────────────────────────────────────
  const updateEdgeData = useCanvasStore((s) => s.updateEdgeData);

  const isActive = selected || isHovered;

  return (
    <>
      {/* Invisible wide stroke for easier hover/click detection */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: "pointer" }}
      />

      {/* Actual visible edge */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: edgeColor,
          strokeWidth: isActive ? 2.5 : 1.5,
          opacity: isActive ? 1 : 0.6,
          transition: "stroke-width 0.15s, opacity 0.15s",
          strokeDasharray: data?.animated ? "6 3" : undefined,
        }}
        markerEnd={`url(#arrowhead-${edgeColor.replace("#", "")})`}
      />

      <EdgeLabelRenderer>
        {/* Label */}
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isEditing ? (
            <input
              autoFocus
              value={value}
              onChange={handleChange}
              onBlur={save}
              onKeyDown={handleKeyDown}
              onMouseDown={(e) => e.stopPropagation()}
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                "border bg-card text-foreground",
                "outline-none shadow-md",
                "min-w-[60px]"
              )}
              style={{
                borderColor: edgeColor,
                width: `${Math.max(value.length * 8 + 24, 60)}px`,
              }}
            />
          ) : (
            <div
              onDoubleClick={(e) => {
                e.stopPropagation();
                startEditing();
              }}
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                "border bg-card text-foreground",
                "shadow-sm cursor-text select-none",
                "transition-all duration-150",
                isActive
                  ? "opacity-100 scale-105"
                  : "opacity-80"
              )}
              style={{
                borderColor: isActive ? edgeColor : "hsl(var(--border))",
                color: isActive ? edgeColor : undefined,
              }}
              title="Double-click to edit"
            >
              {data?.label || "Choice"}
            </div>
          )}
        </div>

        {/* Delete button — appears on hover offset from label */}
        <EdgeDeleteButton
          edgeId={id}
          x={labelX + 36}
          y={labelY - 12}
          visible={isHovered || (selected ?? false)}
        />
      </EdgeLabelRenderer>
    </>
  );
}