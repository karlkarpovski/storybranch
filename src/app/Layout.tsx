// src/app/Layout.tsx
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { useCanvasStore } from "@/features/canvas/store/canvasStore";
import { ProjectMenu } from "@/features/project/components/ProjectMenu";
import { AutosaveIndicator } from "@/features/project/components/AutosaveIndicator";
import { useAutosave } from "@/features/project/hooks/useAutosave";
import { Users, Image, StickyNote, Search } from "lucide-react";
import type { SidebarPanel } from "@/types";

interface LayoutProps {
  children: React.ReactNode;
}

const SIDEBAR_ICONS: {
  panel: SidebarPanel;
  icon: React.ElementType;
  title: string;
}[] = [
  { panel: "characters", icon: Users,      title: "Characters" },
  { panel: "assets",     icon: Image,      title: "Assets"     },
  { panel: "notes",      icon: StickyNote, title: "Notes"      },
  { panel: "search",     icon: Search,     title: "Search"     },
];

export function Layout({ children }: LayoutProps) {
  // ✅ All hooks called INSIDE the component
  useTheme();

  const { status } = useAutosave(); // ← was outside before, now inside

  const isDirty = useStore((s) => s.isDirty);
  const metadata = useStore((s) => s.metadata);
  const activeSidebarPanel = useStore((s) => s.activeSidebarPanel);
  const setActiveSidebarPanel = useStore((s) => s.setActiveSidebarPanel);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* ── Title Bar ───────────────────────────────────────────────────── */}
      <header
        className={cn(
          "flex items-center justify-between",
          "h-10 px-4 shrink-0",
          "bg-card border-b border-border select-none"
        )}
        data-tauri-drag-region
      >
        {/* Left: File menu + project name */}
        <div className="flex items-center gap-3">
          <ProjectMenu />
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-primary font-semibold text-sm tracking-wide">
              StoryBranch
            </span>
            {metadata && (
              <>
                <span className="text-muted-foreground text-sm">/</span>
                <span className="text-sm text-foreground">
                  {metadata.name}
                </span>
                {isDirty && (
                  <span
                    className="w-2 h-2 rounded-full bg-primary"
                    title="Unsaved changes"
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Right: autosave status */}
        <AutosaveIndicator status={status} />
      </header>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div
        className="flex flex-1 overflow-hidden"
        style={{ minHeight: 0 }}
      >
        {/* Icon rail */}
        <aside
          className={cn(
            "flex flex-col items-center",
            "w-12 shrink-0 py-2 gap-1",
            "bg-card border-r border-border"
          )}
        >
          {SIDEBAR_ICONS.map(({ panel, icon: Icon, title }) => (
            <button
              key={panel}
              title={title}
              onClick={() => setActiveSidebarPanel(panel)}
              className={cn(
                "w-9 h-9 rounded-md flex items-center justify-center",
                "transition-colors",
                activeSidebarPanel === panel
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon size={16} />
            </button>
          ))}
        </aside>

        {/* Sidebar panel */}
        <Sidebar />

        {/* Main canvas */}
        <main
          className="overflow-hidden relative"
          style={{ flex: 1, minWidth: 0, minHeight: 0 }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}