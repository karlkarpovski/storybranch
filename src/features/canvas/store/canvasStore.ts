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
import type { SceneNodeData, ChoiceEdgeData, NoteNodeData } from "@/types";
import { DEFAULT_EDGE_COLOR } from "@/features/edges/constants";
import { useHistoryStore } from "./historyStore";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SceneNode = Node<SceneNodeData>;
export type NoteNode = Node<NoteNodeData>;
export type ChoiceEdge = Edge<ChoiceEdgeData>;
export type CanvasNode = SceneNode | NoteNode;

interface CanvasState {
  nodes: CanvasNode[];
  edges: ChoiceEdge[];
  selectedNodeIds: string[];
}

interface CanvasActions {
  onNodesChange: (changes: NodeChange<CanvasNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<ChoiceEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  addSceneNode: (position: { x: number; y: number }) => void;
  addNoteNode: (position: { x: number; y: number }) => void;
  duplicateNode: (id: string) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  updateNodeData: (id: string, data: Partial<SceneNodeData>) => void;
  updateEdgeLabel: (id: string, label: string) => void;
  updateEdgeData: (id: string, data: Partial<ChoiceEdgeData>) => void;
  setSelectedNodeIds: (ids: string[]) => void;
  restoreSnapshot: (nodes: CanvasNode[], edges: ChoiceEdge[]) => void;
  clearCanvas: () => void;
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

export function createDefaultEdgeData(
  overrides?: Partial<ChoiceEdgeData>
): ChoiceEdgeData {
  return {
    label: "Choice",
    condition: undefined,
    color: DEFAULT_EDGE_COLOR,
    edgeType: "bezier",
    animated: false,
    ...overrides,
  };
}

// ✅ Use CanvasNode[] throughout — not SceneNode[]
function cloneNodes(nodes: CanvasNode[]): CanvasNode[] {
  return nodes.map((n) => ({
    ...n,
    data: { ...n.data },
    position: { ...n.position },
  })) as unknown as CanvasNode[];
}

function cloneEdges(edges: ChoiceEdge[]): ChoiceEdge[] {
  return edges.map((e) => ({
    ...e,
    data: e.data ? { ...e.data } : e.data,
  }));
}

function pushSnapshot(
  nodes: CanvasNode[],
  edges: ChoiceEdge[],
  label: string
) {
  useHistoryStore.getState().pushSnapshot({
    nodes: cloneNodes(nodes),
    edges: cloneEdges(edges),
    timestamp: Date.now(),
    label,
  });
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const DEMO_NODES: CanvasNode[] = [
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
    data: createDefaultEdgeData({ label: "Accept", color: "#a855f7" }),
  },
  {
    id: "edge-2",
    source: "node-1",
    target: "node-3",
    type: "choiceEdge",
    data: createDefaultEdgeData({ label: "Reject", color: "#ef4444" }),
  },
];

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCanvasStore = create<CanvasStore>()(
  devtools(
    (set, get) => ({
      nodes: DEMO_NODES,
      edges: DEMO_EDGES,
      selectedNodeIds: [],

      // ── React Flow handlers ────────────────────────────────────────────

      onNodesChange: (changes: NodeChange<CanvasNode>[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes) as unknown as CanvasNode[],
        });
      },

      onEdgesChange: (changes: EdgeChange<ChoiceEdge>[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges) as ChoiceEdge[],
        });
      },

      onConnect: (connection: Connection) => {
        const { nodes, edges } = get();
        pushSnapshot(nodes, edges, "Connect Nodes");
        set({
          edges: addEdge(
            {
              ...connection,
              id: generateId(),
              type: "choiceEdge",
              data: createDefaultEdgeData(),
            },
            edges
          ) as ChoiceEdge[],
        });
      },

      // ── Node actions ───────────────────────────────────────────────────

      addSceneNode: (position) => {
        const { nodes, edges } = get();
        pushSnapshot(nodes, edges, "Add Node");
        const id = generateId();
        const sceneNodes = nodes.filter((n) => n.type === "sceneNode");
        set({
          nodes: [
            ...nodes,
            {
              id,
              type: "sceneNode",
              position,
              data: createDefaultSceneNodeData(`Scene ${sceneNodes.length + 1}`),
            } as SceneNode,
          ],
        });
      },

      addNoteNode: (position) => {
        const { nodes, edges } = get();
        pushSnapshot(nodes, edges, "Add Note");
        const id = generateId();
        const newNote: NoteNode = {
          id,
          type: "noteNode",
          position,
          data: {
            content: "",
            color: "#fef08a",
            fontSize: 14,
          },
        };
        set({ nodes: [...nodes, newNote] });
      },

      duplicateNode: (id) => {
        const { nodes, edges } = get();
        const source = nodes.find((n) => n.id === id);
        if (!source) return;

        pushSnapshot(nodes, edges, "Duplicate Node");
        const newId = generateId();

        // Only duplicate scene nodes fully — notes just copy position
        if (source.type === "sceneNode") {
          const sceneSource = source as SceneNode;
          set({
            nodes: [
              ...nodes,
              {
                ...sceneSource,
                id: newId,
                position: {
                  x: sceneSource.position.x + 40,
                  y: sceneSource.position.y + 40,
                },
                data: {
                  ...sceneSource.data,
                  label: `${sceneSource.data.label} (Copy)`,
                  dialogues: sceneSource.data.dialogues.map((d) => ({
                    ...d,
                    id: generateId(),
                  })),
                },
                selected: false,
              } as SceneNode,
            ],
          });
        } else {
          set({
            nodes: [
              ...nodes,
              {
                ...source,
                id: newId,
                position: {
                  x: source.position.x + 40,
                  y: source.position.y + 40,
                },
                selected: false,
              },
            ] as unknown as CanvasNode[],
          });
        }
      },

      deleteNode: (id) => {
        const { nodes, edges } = get();
        pushSnapshot(nodes, edges, "Delete Node");
        set({
          nodes: nodes.filter((n) => n.id !== id),
          edges: edges.filter(
            (e) => e.source !== id && e.target !== id
          ),
        });
      },

      deleteEdge: (id) => {
        const { nodes, edges } = get();
        pushSnapshot(nodes, edges, "Delete Edge");
        set({ edges: edges.filter((e) => e.id !== id) });
      },

      updateNodeData: (id, data) => {
        const { nodes, edges } = get();
        pushSnapshot(nodes, edges, "Update Node");
        set({
          nodes: nodes.map((n) =>
            n.id === id ? { ...n, data: { ...n.data, ...data } } : n
          ) as unknown as CanvasNode[],
        });
      },

      // ── Edge actions ───────────────────────────────────────────────────

      updateEdgeLabel: (id, label) => {
        const { nodes, edges } = get();
        pushSnapshot(nodes, edges, "Update Edge Label");
        set({
          edges: edges.map((e) =>
            e.id === id
              ? { ...e, data: createDefaultEdgeData({ ...e.data, label }) }
              : e
          ),
        });
      },

      updateEdgeData: (id, data) => {
        const { edges } = get();
        set({
          edges: edges.map((e) =>
            e.id === id
              ? { ...e, data: createDefaultEdgeData({ ...e.data, ...data }) }
              : e
          ),
        });
      },

      // ── Selection ──────────────────────────────────────────────────────

      setSelectedNodeIds: (ids) => {
        set({ selectedNodeIds: ids });
      },

      // ── History ────────────────────────────────────────────────────────

      restoreSnapshot: (nodes, edges) => {
        set({ nodes: nodes as unknown as CanvasNode[], edges, selectedNodeIds: [] });
      },

      clearCanvas: () => {
        const { nodes, edges } = get();
        pushSnapshot(nodes, edges, "Clear Canvas");
        set({ nodes: [], edges: [], selectedNodeIds: [] });
      },
    }),
    { name: "StoryBranch:Canvas" }
  )
);