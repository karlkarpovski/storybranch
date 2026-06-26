// src/features/nodes/components/SceneNodeHeader.tsx
import { ChevronDown, ChevronRight } from "lucide-react";
import { ColorPicker } from "./ColorPicker";
import { useNodeEditor } from "../hooks/useNodeEditor";
import { cn } from "@/lib/utils";

interface SceneNodeHeaderProps {
  nodeId: string;
  label: string;
  color: string;
  isCollapsed: boolean;
  onLabelChange: (label: string) => void;
  onColorChange: (color: string) => void;
  onToggleCollapse: () => void;
}

export function SceneNodeHeader({
  label,
  color,
  isCollapsed,
  onLabelChange,
  onColorChange,
  onToggleCollapse,
}: SceneNodeHeaderProps) {
  const {
    value,
    isEditing,
    inputRef,
    startEditing,
    handleChange,
    handleKeyDown,
    handleBlur,
  } = useNodeEditor({ initialValue: label, onSave: onLabelChange });

  return (
    <div className="relative">
      {/* Color accent stripe */}
      <div
        className="h-1 w-full rounded-t-lg transition-colors duration-200"
        style={{ backgroundColor: color }}
      />

      {/* Header content */}
      <div className="flex items-center gap-1.5 px-2.5 py-2">
        {/* Color picker dot */}
        <div
          // noDrag tells React Flow: don't start dragging from this element
          className="noDrag"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <ColorPicker value={color} onChange={onColorChange} />
        </div>

        {/* Scene label */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              ref={inputRef}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              autoFocus
              className={cn(
                "w-full bg-transparent text-sm font-semibold",
                "text-foreground outline-none",
                "border-b border-primary/50 pb-px",
                "placeholder:text-muted-foreground",
                "noDrag"
              )}
              placeholder="Scene name..."
              maxLength={80}
              // Critical: stop ALL mouse events from reaching React Flow
              onMouseDown={(e) => e.stopPropagation()}
            />
          ) : (
            <p
              className={cn(
                "text-sm font-semibold text-foreground",
                "truncate cursor-text select-none",
                "hover:text-primary transition-colors",
                "noDrag" // tells React Flow not to drag from here
              )}
              title="Double-click to edit"
              // Stop mousedown so React Flow doesn't steal the interaction
              onMouseDown={(e) => e.stopPropagation()}
              onDoubleClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                startEditing();
              }}
            >
              {label || "Untitled Scene"}
            </p>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className={cn(
            "w-5 h-5 flex items-center justify-center",
            "text-muted-foreground hover:text-foreground",
            "transition-colors rounded noDrag"
          )}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? (
            <ChevronRight size={13} />
          ) : (
            <ChevronDown size={13} />
          )}
        </button>
      </div>
    </div>
  );
}