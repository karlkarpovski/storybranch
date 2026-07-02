// src/components/sidebar/Sidebar.tsx
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { SidebarHeader } from "./SidebarHeader";
import { CharacterManager } from "@/features/characters/components/CharacterManager";
import { AssetManager } from "@/features/assets/components/AssetManager";
import type { SidebarPanel } from "@/types";

const PANEL_CONFIG: Record<
  Exclude<SidebarPanel, null>,
  { title: string; description: string }
> = {
  characters: {
    title: "Characters",
    description: "Manage your story's cast",
  },
  assets: {
    title: "Assets",
    description: "Images, audio, and media",
  },
  notes: {
    title: "Notes",
    description: "Double-click canvas to place a note",
  },
  search: {
    title: "Search",
    description: "Search scenes and dialogue",
  },
};

export function Sidebar() {
  const isSidebarOpen = useStore((s) => s.isSidebarOpen);
  const activeSidebarPanel = useStore((s) => s.activeSidebarPanel);

  if (!isSidebarOpen || !activeSidebarPanel) return null;

  const config = PANEL_CONFIG[activeSidebarPanel];

  return (
    <div
      className={cn(
        "flex flex-col w-64 shrink-0",
        "bg-card border-r border-border",
        "animate-slide-in overflow-hidden"
      )}
    >
      <SidebarHeader
        title={config.title}
        description={config.description}
      />

      <div className="flex-1 overflow-hidden">
        {activeSidebarPanel === "characters" && <CharacterManager />}
        {activeSidebarPanel === "assets" && <AssetManager />}
        {activeSidebarPanel === "notes" && (
          <div className="p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Switch to the Notes panel and double-click anywhere on the
              canvas to place a sticky note.
            </p>
          </div>
        )}
        {activeSidebarPanel === "search" && (
          <div className="p-3">
            <p className="text-xs text-muted-foreground">
              Search coming in Phase 8.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}