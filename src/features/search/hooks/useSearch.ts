// src/features/search/hooks/useSearch.ts
// Searches all canvas nodes and characters for a query string.
// On result select: pans canvas to node and pulses it.

import { useState, useMemo, useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { useCanvasStore } from "@/features/canvas/store/canvasStore";
import { useStore } from "@/store";
import type { SearchResult } from "../types";
import type { SceneNode } from "@/features/canvas/store/canvasStore";
import type { NoteNodeData, SceneNodeData } from "@/types";
import { useSearchStore } from "../store/searchStore";


const HIGHLIGHT_DURATION_MS = 1500;

function excerpt(text: string, query: string, radius = 40): string {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return text.slice(0, radius * 2);
  const start = Math.max(0, idx - radius);
  const end = Math.min(text.length, idx + query.length + radius);
  const result = text.slice(start, end);
  return (start > 0 ? "..." : "") + result + (end < text.length ? "..." : "");
}

export function useSearch() {
  const [query, setQuery] = useState("");
  const { fitView, getNode } = useReactFlow();
  const setHighlightedNodeId = useSearchStore((s) => s.setHighlightedNodeId);
  const nodes = useCanvasStore((s) => s.nodes);
  const characters = useStore((s) => s.characters);

  // ── Search logic ──────────────────────────────────────────────────────

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const found: SearchResult[] = [];

    nodes.forEach((node) => {
      if (node.type === "sceneNode") {
        const data = node.data as SceneNodeData;

        // Scene name
        if (data.label?.toLowerCase().includes(q)) {
          found.push({
            id: `${node.id}-label`,
            nodeId: node.id,
            type: "scene",
            title: data.label,
            excerpt: excerpt(data.label, q),
            matchedField: "Scene Name",
          });
        }

        // Description
        if (data.description?.toLowerCase().includes(q)) {
          found.push({
            id: `${node.id}-desc`,
            nodeId: node.id,
            type: "description",
            title: data.label,
            excerpt: excerpt(data.description, q),
            matchedField: "Description",
          });
        }

        // Dialogues
        data.dialogues?.forEach((line, i) => {
          if (line.text?.toLowerCase().includes(q)) {
            found.push({
              id: `${node.id}-dialogue-${i}`,
              nodeId: node.id,
              type: "dialogue",
              title: data.label,
              excerpt: excerpt(line.text, q),
              matchedField: "Dialogue",
            });
          }
        });

        // Tags
        data.tags?.forEach((tag) => {
          if (tag.toLowerCase().includes(q)) {
            found.push({
              id: `${node.id}-tag-${tag}`,
              nodeId: node.id,
              type: "scene",
              title: data.label,
              excerpt: `#${tag}`,
              matchedField: "Tag",
            });
          }
        });
      }

      if (node.type === "noteNode") {
        const data = node.data as NoteNodeData;
        if (data.content?.toLowerCase().includes(q)) {
          found.push({
            id: `${node.id}-note`,
            nodeId: node.id,
            type: "note",
            title: "Note",
            excerpt: excerpt(data.content, q),
            matchedField: "Note",
          });
        }
      }
    });

    // Characters
    Object.values(characters).forEach((char) => {
      if (char.name.toLowerCase().includes(q)) {
        found.push({
          id: `char-${char.id}`,
          nodeId: "",
          type: "character",
          title: char.name,
          excerpt: char.description
            ? excerpt(char.description, q)
            : char.name,
          matchedField: "Character",
        });
      }
      if (char.description?.toLowerCase().includes(q)) {
        found.push({
          id: `char-${char.id}-desc`,
          nodeId: "",
          type: "character",
          title: char.name,
          excerpt: excerpt(char.description, q),
          matchedField: "Character Description",
        });
      }
    });

    return found;
  }, [query, nodes, characters]);

  // ── Focus node on canvas ──────────────────────────────────────────────

  const focusNode = useCallback(
    (nodeId: string) => {
      if (!nodeId) return;

      const node = getNode(nodeId);
      if (!node) return;

      // Pan + zoom to node
      fitView({
        nodes: [{ id: nodeId }],
        duration: 500,
        padding: 0.5,
        maxZoom: 1.5,
      });

      // Highlight pulse
      setHighlightedNodeId(nodeId);
      setTimeout(() => setHighlightedNodeId(null), HIGHLIGHT_DURATION_MS);
    },
    [fitView, getNode]
  );

  return {
    query,
    setQuery,
    results,
    focusNode,
    setHighlightedNodeId,
  };
}