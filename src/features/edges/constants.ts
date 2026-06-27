// src/features/edges/constants.ts
import type { EdgeType } from "@/types";

export const EDGE_TYPES: { label: string; value: EdgeType }[] = [
  { label: "Curved",   value: "bezier" },
  { label: "Straight", value: "straight" },
  { label: "Step",     value: "step" },
];

export const DEFAULT_EDGE_COLOR = "#a855f7";
export const DEFAULT_EDGE_TYPE: EdgeType = "bezier";