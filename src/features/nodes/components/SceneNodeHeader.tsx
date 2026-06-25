// src/features/nodes/components/SceneNodeHeader.tsx
// The top section of a scene node:
// color stripe, scene label (editable), color picker, collapse toggle.

import { useRef } from "react";
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
    <div
      className="relative"
      // Stop React Flow from starting a drag when clicking header controls
      onMouseDown={(e) => {
        const target = e.target as HTMLElement;
        // Allow drag only on the header background itself, not on buttons/inputs
        if (target.tagName === "BUTTON" || target.tagName === "INPUT") {
          e.stopPropagation();
        }
      }}
    >
      {/* Color accent stripe */}
      <div
        className="h-1 w-full rounded-t-lg transition-colors duration-200"
        style={{ backgroundColor: color }}
      />

      {/* Header content */}
      <div className="flex items-center gap-1.5 px-2.5 py-2">
        {/* Color picker dot */}
        <ColorPicker value={color} onChange={onColorChange} />

        {/* Scene label — click to edit */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className={cn(
                "w-full bg-transparent text-sm font-semibold",
                "text-foreground outline-none",
                "border-b border-primary/50 pb-px",
                "placeholder:text-muted-foreground"
              )}
              placeholder="Scene name..."
              maxLength={80}
            />
          ) : (
            <p
              onClick={startEditing}
              className={cn(
                "text-sm font-semibold text-foreground",
                "truncate cursor-text",
                "hover:text-primary transition-colors"
              )}
              title={label}
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
          className={cn(
            "w-5 h-5 flex items-center justify-center",
            "text-muted-foreground hover:text-foreground",
            "transition-colors rounded"
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