// src/app/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactFlowProvider } from "@xyflow/react";
import { Layout } from "./Layout";
import { Canvas } from "@/features/canvas/components/Canvas";
import { useStore } from "@/store";
import { generateId } from "@/lib/utils";
import { useEffect } from "react";
import { useCanvasStore } from "@/features/canvas/store/canvasStore";
import { persistence } from "@/features/project/adapters";
import { useUndoRedo } from "@/hooks/useUndoRedo";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

// Mounts the undo/redo keyboard shortcuts globally
function UndoRedoProvider() {
  useUndoRedo();
  return null;
}

export default function App() {
  const setProjectMetadata = useStore((s) => s.setProjectMetadata);

  // ── Default project on first load ──────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        const draft = await persistence.loadAutosave();
        if (draft) {
          setProjectMetadata(draft.metadata);
          useCanvasStore.getState().restoreSnapshot(
            draft.nodes as never,
            draft.edges as never
          );
          useStore.setState({ characters: draft.characters });
          return;
        }
      } catch (err) {
        console.warn("No autosave found:", err);
      }

      setProjectMetadata({
        id: generateId(),
        name: "Untitled Story",
        description: "",
        author: "",
        version: "0.1.0",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    };

    init();
  }, [setProjectMetadata]);

  // ── Mark dirty on any canvas change ───────────────────────────────────
  useEffect(() => {
    const unsubscribe = useCanvasStore.subscribe(() => {
      useStore.getState().markDirty();
    });
    return unsubscribe;
  }, []);

  // ── Ctrl+S ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        const meta = useStore.getState().metadata;
        if (!meta) return;
        const { nodes, edges } = useCanvasStore.getState();
        const chars = useStore.getState().characters;
        const { serializeProject } = await import(
          "@/features/project/utils/serialization"
        );
        const project = serializeProject(meta, nodes, edges, chars);
        await persistence.saveAs(project);
        useStore.getState().markClean();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        {/* UndoRedoProvider must be inside ReactFlowProvider */}
        <UndoRedoProvider />
        <Layout>
          <Canvas />
        </Layout>
      </ReactFlowProvider>
    </QueryClientProvider>
  );
}