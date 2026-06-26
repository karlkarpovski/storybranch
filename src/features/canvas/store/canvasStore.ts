// src/features/canvas/store/canvasStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import { generateId } from "@/lib/utils";
import type { SceneNodeData, ChoiceEdgeData } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SceneNode = Node<SceneNodeData>;
export type ChoiceEdge = Edge<ChoiceEdgeData>;

interface CanvasState {
  nodes: SceneNode[];
  edges: ChoiceEdge[];
  selectedNodeIds: string[];
}

interface CanvasActions {
  onNodesChange: (changes: NodeChange<SceneNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<ChoiceEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  addSceneNode: (position: { x: number; y: number }) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  updateNodeData: (id: string, data: Partial<SceneNodeData>) => void;
  setSelectedNodeIds: (ids: string[]) => void;
  clearCanvas: () => void;
  updateEdgeLabel: (id: string, label: string) => void;

}

type CanvasStore = CanvasState & CanvasActions;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createDefaultSceneNodeData(label: string): SceneNodeData {
  return {
    label,
    description: "",
    color: "#a855f7",
    imagePath: undefined,
    characterIds: [],
    dialogues: [],
    tags: [],
    isCollapsed: false,
  };
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const DEMO_NODES: SceneNode[] = [
  {
    id: "node-1",
    type: "sceneNode",
    position: { x: 200, y: 200 },
    data: createDefaultSceneNodeData("Opening Scene"),
  },
  {
    id: "node-2",
    type: "sceneNode",
    position: { x: 520, y: 100 },
    data: createDefaultSceneNodeData("Accept Invitation"),
  },
  {
    id: "node-3",
    type: "sceneNode",
    position: { x: 520, y: 320 },
    data: createDefaultSceneNodeData("Reject Invitation"),
  },
];

const DEMO_EDGES: ChoiceEdge[] = [
  {
    id: "edge-1",
    source: "node-1",
    target: "node-2",
    type: "choiceEdge",
    data: { label: "Accept", condition: undefined, color: "#a855f7" },
  },
  {
    id: "edge-2",
    source: "node-1",
    target: "node-3",
    type: "choiceEdge",
    data: { label: "Reject", condition: undefined, color: "#ef4444" },
  },
];

// ─── Store ────────────────────────────────────────────────────────────────────
// NOTE: Immer is intentionally NOT used here.
// applyNodeChanges/applyEdgeChanges return new arrays and cannot
// operate on Immer draft proxies — they must use plain set().

export const useCanvasStore = create<CanvasStore>()(
  devtools(
    (set, get) => ({
      nodes: DEMO_NODES,
      edges: DEMO_EDGES,
      selectedNodeIds: [],

      // React Flow calls this on every node move/select/remove.
      // applyNodeChanges returns a new array — assign directly.
      onNodesChange: (changes: NodeChange<SceneNode>[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes) as SceneNode[],
        });
      },

      onEdgesChange: (changes: EdgeChange<ChoiceEdge>[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges) as ChoiceEdge[],
        });
      },

      onConnect: (connection: Connection) => {
        set({
          edges: addEdge(
            {
              ...connection,
              id: generateId(),
              type: "choiceEdge",
              data: {
                label: "Choice",
                condition: undefined,
                color: "#a855f7",
              },
            },
            get().edges
          ) as ChoiceEdge[],
        });
      },

      addSceneNode: (position: { x: number; y: number }) => {
        const id = generateId();
        const nodeCount = get().nodes.length + 1;
        set({
          nodes: [
            ...get().nodes,
            {
              id,
              type: "sceneNode",
              position,
              data: createDefaultSceneNodeData(`Scene ${nodeCount}`),
            },
          ],
        });
      },

      deleteNode: (id: string) => {
        set({
          nodes: get().nodes.filter((n) => n.id !== id),
          edges: get().edges.filter(
            (e) => e.source !== id && e.target !== id
          ),
        });
      },

      deleteEdge: (id: string) => {
        set({
          edges: get().edges.filter((e) => e.id !== id),
        });
      },

      updateNodeData: (id: string, data: Partial<SceneNodeData>) => {
        set({
          nodes: get().nodes.map((n) =>
            n.id === id ? { ...n, data: { ...n.data, ...data } } : n
          ),
        });
      },

      setSelectedNodeIds: (ids: string[]) => {
        set({ selectedNodeIds: ids });
      },

      clearCanvas: () => {
        set({ nodes: [], edges: [], selectedNodeIds: [] });
      },

      updateEdgeLabel: (id: string, label: string) => {
        set({
          edges: get().edges.map((e) =>
            e.id === id
              ? { ...e, data: { ...e.data, label, color: e.data?.color ?? "#a855f7" } }
              : e
          ),
        });
      },
    }),
    { name: "StoryBranch:Canvas" }
  )

);