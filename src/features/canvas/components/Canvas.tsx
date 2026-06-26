// src/features/canvas/components/Canvas.tsx
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
import { SceneNode } from "@/features/nodes/components/SceneNode";
import { PlaceholderChoiceEdge } from "./PlaceholderChoiceEdge";
import type { SceneNode as SceneNodeType, ChoiceEdge } from "../store/canvasStore";

// Defined OUTSIDE component to prevent remounting on every render
const nodeTypes = {
  sceneNode: SceneNode,
};

const edgeTypes = {
  choiceEdge: PlaceholderChoiceEdge,
};

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
          <polygon points="0 0, 10 3.5, 0 7" fill="#a855f7" opacity="0.8" />
        </marker>
      </defs>
    </svg>
  );
}

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

  const handleNodesChange = useCallback(
    (changes: NodeChange<SceneNodeType>[]) => onNodesChange(changes),
    [onNodesChange]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange<ChoiceEdge>[]) => onEdgesChange(changes),
    [onEdgesChange]
  );

  const handleConnect = useCallback(
    (connection: Connection) => onConnect(connection),
    [onConnect]
  );

  const handleSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: SceneNodeType[] }) => {
      setSelectedNodeIds(selectedNodes.map((n) => n.id));
    },
    [setSelectedNodeIds]
  );

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      const target = event.target as HTMLElement;
      const isPane =
        target.classList.contains("react-flow__pane") ||
        target.classList.contains("react-flow__background");
      if (!isPane) return;
      addSceneNode({
        x: event.clientX - 120,
        y: event.clientY - 60,
      });
    },
    [addSceneNode]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "Delete" || e.key === "Backspace") {
        const state = useCanvasStore.getState();
        state.selectedNodeIds.forEach((id) => deleteNode(id));
        state.edges
          .filter((edge) => edge.selected)
          .forEach((edge) => deleteEdge(edge.id));
      }

      if ((e.key === "a" || e.key === "A") && !e.metaKey && !e.ctrlKey) {
        addSceneNode({
          x: 300 + Math.random() * 300,
          y: 200 + Math.random() * 200,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [addSceneNode, deleteNode, deleteEdge]);

  return (
    <div style={{ width: "100%", height: "100%" }} className="relative">
      <ArrowheadDefs />

      <ReactFlow<SceneNodeType, ChoiceEdge>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onSelectionChange={handleSelectionChange}
        onDoubleClick={handleDoubleClick}
        selectionMode={SelectionMode.Partial}
        selectionOnDrag
        panOnDrag={[1, 2]}
        zoomOnScroll
        zoomOnPinch
        deleteKeyCode={null}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="hsl(var(--canvas-grid))"
        />
        <MiniMap
          nodeColor={(node) => (node as SceneNodeType).data?.color ?? "#a855f7"}
          maskColor="hsl(var(--background) / 0.7)"
          style={{ width: 160, height: 100 }}
        />
        <Controls showInteractive={false} />
        <CanvasToolbar />
      </ReactFlow>
    </div>
  );
}