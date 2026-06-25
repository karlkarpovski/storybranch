// src/features/nodes/components/ColorPicker.tsx
// A compact popover color picker using preset swatches.

import * as Popover from "@radix-ui/react-popover";
import { NODE_COLORS } from "../constants";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          title="Change node color"
          className={cn(
            "w-4 h-4 rounded-full border-2 border-white/30",
            "hover:scale-110 transition-transform",
            "focus:outline-none focus:ring-2 focus:ring-white/50"
          )}
          style={{ backgroundColor: value }}
          // Prevent React Flow from handling this click
          onMouseDown={(e) => e.stopPropagation()}
        />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={8}
          className={cn(
            "z-50 p-2 rounded-lg shadow-xl",
            "bg-card border border-border",
            "animate-fade-in"
          )}
          // Prevent React Flow drag when interacting with popover
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-5 gap-1.5">
            {NODE_COLORS.map((color) => (
              <button
                key={color.value}
                title={color.label}
                onClick={() => onChange(color.value)}
                className={cn(
                  "w-6 h-6 rounded-full transition-transform",
                  "hover:scale-110 focus:outline-none",
                  "focus:ring-2 focus:ring-offset-1 focus:ring-offset-card",
                  value === color.value && "ring-2 ring-white scale-110"
                )}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
          <Popover.Arrow className="fill-border" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}