// src/features/edges/components/EdgeDeleteButton.tsx
// A small × button rendered on edge hover to delete the edge.

import { X } from "lucide-react";
import { useCanvasStore } from "@/features/canvas/store/canvasStore";
import { cn } from "@/lib/utils";

interface EdgeDeleteButtonProps {
  edgeId: string;
  x: number;
  y: number;
  visible: boolean;
}

export function EdgeDeleteButton({
  edgeId,
  x,
  y,
  visible,
}: EdgeDeleteButtonProps) {
  const deleteEdge = useCanvasStore((s) => s.deleteEdge);

  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(-50%, -50%) translate(${x}px,${y}px)`,
        pointerEvents: visible ? "all" : "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.15s",
      }}
      className="nodrag nopan"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteEdge(edgeId);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className={cn(
          "w-5 h-5 rounded-full flex items-center justify-center",
          "bg-destructive text-destructive-foreground",
          "hover:bg-destructive/80 transition-colors",
          "shadow-md border border-destructive/50",
          "focus:outline-none"
        )}
        title="Delete connection"
      >
        <X size={10} strokeWidth={3} />
      </button>
    </div>
  );
}