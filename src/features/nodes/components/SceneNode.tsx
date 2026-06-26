// src/features/nodes/components/SceneNode.tsx
// The main scene node component — composes header, body, context menu,
// and handles all data update callbacks.

import { memo, useCallback } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useCanvasStore } from "@/features/canvas/store/canvasStore";
import { SceneNodeHeader } from "./SceneNodeHeader";
import { SceneNodeBody } from "./SceneNodeBody";
import { SceneNodeContextMenu } from "./SceneNodeContextMenu";
import { cn } from "@/lib/utils";
import type { SceneNode as SceneNodeFlow } from "@/features/canvas/store/canvasStore";
import type { SceneNodeData } from "@/types";

// ─── Handle component ─────────────────────────────────────────────────────────

function NodeHandle({
  type,
  position,
}: {
  type: "source" | "target";
  position: Position;
}) {
  return (
    <Handle
      type={type}
      position={position}
      className={cn(
        "!w-3 !h-3 !rounded-full !border-2",
        "!border-node-border !bg-card",
        "hover:!border-primary hover:!bg-primary/30",
        "!transition-all"
      )}
    />
  );
}

// ─── Scene Node ───────────────────────────────────────────────────────────────

export const SceneNode = memo(function SceneNode({
  id,
  data,
  selected,
  positionAbsoluteX,
  positionAbsoluteY,
}: NodeProps<SceneNodeFlow>) {
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);

  const handleUpdate = useCallback(
    (updates: Partial<SceneNodeData>) => {
      updateNodeData(id, updates);
    },
    [id, updateNodeData]
  );

  const handleLabelChange = useCallback(
    (label: string) => handleUpdate({ label }),
    [handleUpdate]
  );

  const handleColorChange = useCallback(
    (color: string) => handleUpdate({ color }),
    [handleUpdate]
  );

  const handleToggleCollapse = useCallback(
    () => handleUpdate({ isCollapsed: !data.isCollapsed }),
    [handleUpdate, data.isCollapsed]
  );

  return (
    <SceneNodeContextMenu
      nodeId={id}
      nodeData={data}
      nodePosition={{ x: positionAbsoluteX, y: positionAbsoluteY }}
    >
      <div
        className={cn(
          "min-w-[200px] max-w-[320px] rounded-lg border-2",
          "bg-node-bg shadow-lg",
          "transition-all duration-150",
          selected
            ? "border-primary shadow-primary/20 shadow-xl"
            : "border-node-border hover:border-primary/40",
          selected && "ring-1 ring-primary/20"
        )}
        style={{ width: 240 }}
      >
        {/* Left target handle */}
        <NodeHandle type="target" position={Position.Left} />

        {/* Header: color stripe + label + color picker + collapse */}
        <SceneNodeHeader
          nodeId={id}
          label={data.label}
          color={data.color}
          isCollapsed={data.isCollapsed}
          onLabelChange={handleLabelChange}
          onColorChange={handleColorChange}
          onToggleCollapse={handleToggleCollapse}
        />

        {/* Body: description + characters + dialogues (hidden when collapsed) */}
        {!data.isCollapsed && (
          <SceneNodeBody
            nodeId={id}
            data={data}
            onUpdate={handleUpdate}
          />
        )}

        {/* Right source handle */}
        <NodeHandle type="source" position={Position.Right} />
      </div>
    </SceneNodeContextMenu>
  );
});