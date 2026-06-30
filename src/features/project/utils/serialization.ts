// src/features/project/utils/serialization.ts
// Converts live app state into a saveable ProjectFile and back.

import type { ProjectFile, ProjectMetadata, Character } from "@/types";
import type { CanvasNode, ChoiceEdge } from "@/features/canvas/store/canvasStore";

const SCHEMA_VERSION = "1.0.0";

export function serializeProject(
  metadata: ProjectMetadata,
  nodes: CanvasNode[],
  edges: ChoiceEdge[],
  characters: Record<string, Character>
): ProjectFile {
  return {
    version: SCHEMA_VERSION,
    metadata: {
      ...metadata,
      updatedAt: new Date().toISOString(),
    },
    nodes,
    edges,
    characters,
  };
}

export function deserializeProject(raw: unknown): ProjectFile {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Invalid project file: not a JSON object");
  }

  const file = raw as Partial<ProjectFile>;

  if (!file.version) {
    throw new Error("Invalid project file: missing version");
  }
  if (!file.metadata) {
    throw new Error("Invalid project file: missing metadata");
  }
  if (!Array.isArray(file.nodes) || !Array.isArray(file.edges)) {
    throw new Error("Invalid project file: missing nodes or edges");
  }

  // Future: version migration logic goes here
  // if (file.version === "0.9.0") { ...upgrade... }

  return {
    version: file.version,
    metadata: file.metadata,
    nodes: file.nodes,
    edges: file.edges,
    characters: file.characters ?? {},
  };
}

export function generateFileName(projectName: string): string {
  const safe = projectName
    .trim()
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase();
  return `${safe || "untitled"}.storybranch`;
}