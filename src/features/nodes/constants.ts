// src/features/nodes/constants.ts
// Preset accent colors for scene nodes.
// Writers use color to signal tone: red = conflict, blue = calm, etc.

export const NODE_COLORS = [
  { label: "Purple",  value: "#a855f7" },
  { label: "Blue",    value: "#3b82f6" },
  { label: "Cyan",    value: "#06b6d4" },
  { label: "Green",   value: "#22c55e" },
  { label: "Yellow",  value: "#eab308" },
  { label: "Orange",  value: "#f97316" },
  { label: "Red",     value: "#ef4444" },
  { label: "Pink",    value: "#ec4899" },
  { label: "White",   value: "#e2e8f0" },
  { label: "Gray",    value: "#64748b" },
] as const;

export const DEFAULT_NODE_COLOR = "#a855f7";
export const NODE_MIN_WIDTH = 200;
export const NODE_MAX_WIDTH = 400;