// src/app/Layout.tsx
// The application shell.
// Title bar + left sidebar + main canvas area.
// Uses CSS Grid for layout — sidebar width is a CSS variable for
// smooth animated resizing in later phases.

import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { ProjectMenu } from "@/features/project/components/ProjectMenu";
import { AutosaveIndicator } from "@/features/project/components/AutosaveIndicator";
import { useAutosave } from "@/features/project/hooks/useAutosave";

const { status } = useAutosave();

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // Apply theme on mount and changes
  useTheme();

  const isDirty = useStore((s) => s.isDirty);
  const metadata = useStore((s) => s.metadata);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* ── Title Bar ─────────────────────────────────────────────────────── */}
      <header
        className={cn(
          "flex items-center justify-between",
          "h-10 px-4 shrink-0",
          "bg-card border-b border-border",
          "select-none"
        )}
        // data-tauri-drag-region makes this the native drag handle on macOS/Windows
        data-tauri-drag-region
      >
        {/* App name + project name */}
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
                <span className="text-sm text-foreground">{metadata.name}</span>
                {isDirty && (
                  <span className="w-2 h-2 rounded-full bg-primary" title="Unsaved changes" />
                )}
              </>
            )}
          </div>
        </div>

        <AutosaveIndicator status={status} />

        {/* Window controls placeholder — Tauri handles native controls */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">
            ⌘S
          </kbd>
          <span>Save</span>
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left activity bar (icon rail — full sidebar in Phase 6) */}
        <aside
          className={cn(
            "flex flex-col items-center",
            "w-12 shrink-0 py-2 gap-1",
            "bg-card border-r border-border"
          )}
        >
          {/* Placeholder icons — replaced in Phase 6 */}
          {["⬡", "♟", "🖼", "🔍"].map((icon, i) => (
            <button
              key={i}
              className={cn(
                "w-9 h-9 rounded-md",
                "flex items-center justify-center text-base",
                "text-muted-foreground hover:text-foreground",
                "hover:bg-accent transition-colors"
              )}
            >
              {icon}
            </button>
          ))}
        </aside>

        {/* Main content area — canvas lives here */}
        <main className="flex-1 overflow-hidden relative" style={{ height: "100%" }}>
          {children}
        </main>
      </div>
    </div>
  );
}