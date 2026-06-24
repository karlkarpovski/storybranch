// src/features/canvas/components/PlaceholderSceneNode.tsx
// A minimal node for Phase 2.
// Phase 3 replaces this with the full SceneNode component.

import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { SceneNode } from "../store/canvasStore";
import { cn } from "@/lib/utils";

export function PlaceholderSceneNode({ data, selected }: NodeProps<SceneNode>) {
  return (
    <div
      className={cn(
        "min-w-[180px] rounded-lg border-2 overflow-hidden",
        "bg-node-bg shadow-lg transition-shadow",
        selected
          ? "border-primary shadow-primary/20 shadow-xl"
          : "border-node-border hover:border-primary/50"
      )}
    >
      {/* Header stripe — uses the node's color */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: data.color }}
      />

      {/* Content */}
      <div className="px-3 py-2.5">
        <p className="text-sm font-semibold text-foreground leading-tight">
          {data.label}
        </p>
        {data.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {data.description}
          </p>
        )}
        <p className="text-xs text-muted-foreground/50 mt-2 font-mono">
          scene
        </p>
      </div>

      {/* Handles — top/bottom for clean vertical layouts */}
      <Handle
        type="target"
        position={Position.Left}
        className={cn(
          "!w-3 !h-3 !rounded-full !border-2",
          "!border-node-border !bg-card",
          "hover:!border-primary hover:!bg-primary/20",
          "transition-colors"
        )}
      />
      <Handle
        type="source"
        position={Position.Right}
        className={cn(
          "!w-3 !h-3 !rounded-full !border-2",
          "!border-node-border !bg-card",
          "hover:!border-primary hover:!bg-primary/20",
          "transition-colors"
        )}
      />
    </div>
  );
}