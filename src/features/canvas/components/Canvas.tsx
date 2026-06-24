// src/features/canvas/components/Canvas.tsx
// The main React Flow canvas component.
// Wires together: flow instance, store, node types, edge types,
// background, minimap, controls, and keyboard shortcuts.

import { useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
  SelectionMode,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "@xyflow/react";

import { useCanvasStore } from "../store/canvasStore";
import { CanvasToolbar } from "./CanvasToolbar";
import { PlaceholderSceneNode } from "./PlaceholderSceneNode";
import { PlaceholderChoiceEdge } from "./PlaceholderChoiceEdge";
import type { SceneNode, ChoiceEdge } from "../store/canvasStore";

// ─── Node & Edge type registries ─────────────────────────────────────────────
// React Flow requires these to be defined OUTSIDE the component
// to prevent remounting on every render.

const nodeTypes = {
  sceneNode: PlaceholderSceneNode,
};

const edgeTypes = {
  choiceEdge: PlaceholderChoiceEdge,
};

// ─── Custom SVG arrowhead marker ─────────────────────────────────────────────

function ArrowheadDefs() {
  return (
    <svg style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#a855f7"
            opacity="0.8"
          />
        </marker>
      </defs>
    </svg>
  );
}


// ─── Canvas ───────────────────────────────────────────────────────────────────

export function Canvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addSceneNode,
    deleteNode,
    deleteEdge,
    setSelectedNodeIds,
  } = useCanvasStore();

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleNodesChange = useCallback(
    (changes: NodeChange<SceneNode>[]) => {
      onNodesChange(changes);
    },
    [onNodesChange]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange<ChoiceEdge>[]) => {
      onEdgesChange(changes);
    },
    [onEdgesChange]
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      onConnect(connection);
    },
    [onConnect]
  );

  // Track selection changes → update store
  const handleSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: SceneNode[] }) => {
      setSelectedNodeIds(selectedNodes.map((n) => n.id));
    },
    [setSelectedNodeIds]
  );

  // Double-click on canvas pane → add a node at that position
  const handlePaneDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      const target = event.target as HTMLElement;
      // Only trigger on the background pane, not on nodes
      if (!target.classList.contains("react-flow__pane")) return;

      const bounds = target.getBoundingClientRect();
      addSceneNode({
        x: event.clientX - bounds.left - 90, // center the node on cursor
        y: event.clientY - bounds.top - 40,
      });
    },
    [addSceneNode]
  );

  // ── Keyboard shortcuts ────────────────────────────────────────────────────

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is in an input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      switch (e.key) {
        case "Delete":
        case "Backspace": {
          // Delete selected nodes
          const { selectedNodeIds, nodes: currentNodes, edges: currentEdges } =
            useCanvasStore.getState();
          selectedNodeIds.forEach((id) => deleteNode(id));
          // Also delete selected edges
          currentEdges
            .filter((edge) => edge.selected)
            .forEach((edge) => deleteEdge(edge.id));
          break;
        }
        case "a":
        case "A": {
          if (!e.metaKey && !e.ctrlKey) {
            addSceneNode({
              x: 300 + Math.random() * 300,
              y: 200 + Math.random() * 200,
            });
          }
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [addSceneNode, deleteNode, deleteEdge]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ width: "100%", height: "100%" }} className="relative">
      <ArrowheadDefs />

      <ReactFlow<SceneNode, ChoiceEdge>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onSelectionChange={handleSelectionChange}
        onPaneClick={() => setSelectedNodeIds([])}
        onDoubleClick={handlePaneDoubleClick}
        // Selection behavior
        selectionMode={SelectionMode.Partial}
        selectionOnDrag={true}
        // Interaction settings
        deleteKeyCode={null}      // We handle delete ourselves above
        multiSelectionKeyCode="Shift"
        panOnScroll={false}
        panOnDrag={[1, 2]}        // Middle mouse or right mouse to pan
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false} // We use double-click for node creation
        // Visual settings
        defaultEdgeOptions={{
          type: "choiceEdge",
          animated: false,
        }}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        {/* Dot grid background */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="hsl(var(--canvas-grid))"
        />

        {/* Minimap */}
        <MiniMap
          nodeColor={(node) => {
            const n = node as SceneNode;
            return n.data?.color ?? "#a855f7";
          }}
          maskColor="hsl(var(--background) / 0.7)"
          style={{ width: 160, height: 100 }}
        />

        {/* Built-in zoom/fit controls */}
        <Controls showInteractive={false} />

        {/* Our custom floating toolbar */}
        <CanvasToolbar />
      </ReactFlow>
    </div>
  );
}