// src/features/nodes/components/SceneNodeContextMenu.tsx
// Right-click context menu for scene nodes.
// Uses Radix ContextMenu for accessibility and positioning.

import * as ContextMenu from "@radix-ui/react-context-menu";
import { useCanvasStore } from "@/features/canvas/store/canvasStore";
import { generateId } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { SceneNodeData } from "@/types";

interface SceneNodeContextMenuProps {
  nodeId: string;
  nodeData: SceneNodeData;
  nodePosition: { x: number; y: number };
  children: React.ReactNode;
}

interface MenuItemProps {
  onClick: () => void;
  variant?: "default" | "danger";
  children: React.ReactNode;
  shortcut?: string;
}

function MenuItem({
  onClick,
  variant = "default",
  children,
  shortcut,
}: MenuItemProps) {
  return (
    <ContextMenu.Item
      onClick={onClick}
      className={cn(
        "flex items-center justify-between gap-8",
        "px-2 py-1.5 rounded-md text-sm",
        "cursor-pointer outline-none select-none",
        "transition-colors",
        variant === "default" && [
          "text-foreground",
          "data-[highlighted]:bg-accent data-[highlighted]:text-foreground",
        ],
        variant === "danger" && [
          "text-destructive",
          "data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive",
        ]
      )}
    >
      <span>{children}</span>
      {shortcut && (
        <span className="text-xs text-muted-foreground font-mono">
          {shortcut}
        </span>
      )}
    </ContextMenu.Item>
  );
}

function MenuSeparator() {
  return <ContextMenu.Separator className="my-1 h-px bg-border" />;
}

export function SceneNodeContextMenu({
  nodeId,
  nodeData,
  nodePosition,
  children,
}: SceneNodeContextMenuProps) {
  const deleteNode = useCanvasStore((s) => s.deleteNode);
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);
  const addSceneNode = useCanvasStore((s) => s.addSceneNode);

  // We need access to full node for duplication
  const nodes = useCanvasStore((s) => s.nodes);

  const handleDuplicate = () => {
    const sourceNode = nodes.find((n) => n.id === nodeId);
    if (!sourceNode) return;
    addSceneNode({
      x: nodePosition.x + 40,
      y: nodePosition.y + 40,
    });
    // updateNodeData will be called by addSceneNode with default data.
    // In Phase 5 we'll do a proper deep duplicate.
  };

  const handleToggleCollapse = () => {
    updateNodeData(nodeId, { isCollapsed: !nodeData.isCollapsed });
  };

  const handleDelete = () => {
    deleteNode(nodeId);
  };

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Content
          className={cn(
            "z-50 min-w-[180px] p-1 rounded-lg shadow-xl",
            "bg-card border border-border",
            "animate-fade-in"
          )}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={handleDuplicate} shortcut="Ctrl+D">
            Duplicate
          </MenuItem>
          <MenuItem onClick={handleToggleCollapse}>
            {nodeData.isCollapsed ? "Expand" : "Collapse"}
          </MenuItem>

          <MenuSeparator />

          <MenuItem onClick={handleDelete} variant="danger" shortcut="Del">
            Delete
          </MenuItem>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}