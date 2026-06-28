// src/types/index.ts
// Global TypeScript types shared across features.
// Feature-specific types live in their own feature folder.

// ─── Character ────────────────────────────────────────────────────────────────

export interface Character {
  id: string;
  name: string;
  description: string;
  color: string;         // hex color, e.g. "#a855f7"
  portraitPath?: string; // local file path to portrait image
  createdAt: string;     // ISO date string
  updatedAt: string;
}



// ─── Dialogue ─────────────────────────────────────────────────────────────────

export interface DialogueLine {
  id: string;
  characterId: string | null; // null = narration
  text: string;
  order: number;
}

// ─── Scene Node Data ──────────────────────────────────────────────────────────
// This is the `data` payload for React Flow nodes.

export interface SceneNodeData extends Record<string, unknown> {
  label: string;
  description: string;
  color: string;
  imagePath?: string;
  characterIds: string[];
  dialogues: DialogueLine[];
  tags: string[];
  isCollapsed: boolean;
}

// Add this type:
export type EdgeType = "bezier" | "straight" | "step";

// Update ChoiceEdgeData:
export interface ChoiceEdgeData extends Record<string, unknown> {
  label: string;
  condition?: string;
  color: string;
  edgeType: EdgeType;
  animated: boolean;
}

// ─── Note ─────────────────────────────────────────────────────────────────────

export interface NoteData {
  id: string;
  content: string;      // Rich text (HTML string for Phase 6)
  color: string;
  width: number;
  height: number;
  x: number;
  y: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Asset ────────────────────────────────────────────────────────────────────

export type AssetType =
  | "background"
  | "portrait"
  | "cg"
  | "bgm"
  | "sfx"
  | "voice";

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  path: string;         // local file path
  thumbnailPath?: string;
  createdAt: string;
}

// ─── Project ──────────────────────────────────────────────────────────────────

export interface ProjectMetadata {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  filePath?: string;    // undefined until first save
}

// ─── Theme ────────────────────────────────────────────────────────────────────

export type Theme = "dark" | "light" | "system";

// ─── UI State ─────────────────────────────────────────────────────────────────

export type SidebarPanel =
  | "characters"
  | "assets"
  | "notes"
  | "search"
  | null;

// ─── Note Node Data ───────────────────────────────────────────────────────────
export interface NoteNodeData extends Record<string, unknown> {
  content: string;
  color: string;
  fontSize: number;
}

  