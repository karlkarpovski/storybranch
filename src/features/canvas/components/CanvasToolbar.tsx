// src/features/canvas/components/CanvasToolbar.tsx
import { useReactFlow } from "@xyflow/react";
import { useCanvasStore } from "../store/canvasStore";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { cn } from "@/lib/utils";
import {
  Plus,
  Minus,
  Maximize2,
  Trash2,
  ZoomIn,
  Undo2,
  Redo2,
  Copy,
} from "lucide-react";

interface ToolbarButtonProps {
  onClick: () => void;
  title: string;
  disabled?: boolean;
  variant?: "default" | "danger";
  children: React.ReactNode;
}

function ToolbarButton({
  onClick,
  title,
  disabled = false,
  variant = "default",
  children,
}: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded-md",
        "text-sm transition-colors",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        variant === "default" && [
          "text-muted-foreground hover:text-foreground",
          "hover:bg-accent",
        ],
        variant === "danger" && [
          "text-muted-foreground hover:text-destructive",
          "hover:bg-destructive/10",
        ]
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-border mx-1" />;
}

export function CanvasToolbar() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { canUndo, canRedo, undo, redo } = useUndoRedo();

  const addSceneNode = useCanvasStore((s) => s.addSceneNode);
  const deleteNode = useCanvasStore((s) => s.deleteNode);
  const duplicateNode = useCanvasStore((s) => s.duplicateNode);
  const selectedNodeIds = useCanvasStore((s) => s.selectedNodeIds);

  const handleAddNode = () => {
    addSceneNode({
      x: 300 + Math.random() * 200,
      y: 200 + Math.random() * 150,
    });
  };

  const handleDeleteSelected = () => {
    selectedNodeIds.forEach((id) => deleteNode(id));
  };

  const handleDuplicateSelected = () => {
    selectedNodeIds.forEach((id) => duplicateNode(id));
  };

  return (
    <div
      className={cn(
        "absolute top-3 left-1/2 -translate-x-1/2 z-10",
        "flex items-center gap-0.5 px-2 py-1.5",
        "bg-card border border-border rounded-lg shadow-lg",
        "animate-fade-in"
      )}
    >
      {/* Undo / Redo */}
      <ToolbarButton
        onClick={undo}
        title="Undo (Ctrl+Z)"
        disabled={!canUndo}
      >
        <Undo2 size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={redo}
        title="Redo (Ctrl+Shift+Z)"
        disabled={!canRedo}
      >
        <Redo2 size={15} />
      </ToolbarButton>

      <Divider />

      {/* Add node */}
      <ToolbarButton onClick={handleAddNode} title="Add Scene Node (A)">
        <Plus size={16} />
      </ToolbarButton>

      {/* Duplicate selected */}
      <ToolbarButton
        onClick={handleDuplicateSelected}
        title="Duplicate Selected (Ctrl+D)"
        disabled={selectedNodeIds.length === 0}
      >
        <Copy size={15} />
      </ToolbarButton>

      <Divider />

      {/* Zoom controls */}
      <ToolbarButton onClick={() => zoomIn()} title="Zoom In">
        <ZoomIn size={15} />
      </ToolbarButton>
      <ToolbarButton onClick={() => zoomOut()} title="Zoom Out">
        <Minus size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => fitView({ duration: 400 })}
        title="Fit View (F)"
      >
        <Maximize2 size={15} />
      </ToolbarButton>

      <Divider />

      {/* Delete selected */}
      <ToolbarButton
        onClick={handleDeleteSelected}
        title="Delete Selected (Del)"
        disabled={selectedNodeIds.length === 0}
        variant="danger"
      >
        <Trash2 size={15} />
      </ToolbarButton>

      {selectedNodeIds.length > 0 && (
        <span className="ml-1 px-1.5 py-0.5 rounded text-xs bg-primary/20 text-primary font-medium">
          {selectedNodeIds.length}
        </span>
      )}
    </div>
  );
}