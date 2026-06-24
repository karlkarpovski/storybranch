// src/app/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactFlowProvider } from "@xyflow/react";
import { Layout } from "./Layout";
import { Canvas } from "@/features/canvas/components/Canvas";
import { useStore } from "@/store";
import { generateId } from "@/lib/utils";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

export default function App() {
  const setProjectMetadata = useStore((s) => s.setProjectMetadata);

  useEffect(() => {
    setProjectMetadata({
      id: generateId(),
      name: "Untitled Story",
      description: "",
      author: "",
      version: "0.1.0",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }, [setProjectMetadata]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* ReactFlowProvider must wrap any component using useReactFlow() */}
      <ReactFlowProvider>
        <Layout>
          <Canvas />
        </Layout>
      </ReactFlowProvider>
    </QueryClientProvider>
  );
}