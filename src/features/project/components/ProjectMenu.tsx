// src/features/project/components/ProjectMenu.tsx
// File menu: New, Open, Save, Save As, Export JSON.

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useStore } from "@/store";
import { useCanvasStore } from "@/features/canvas/store/canvasStore";
import { persistence } from "../adapters";
import { serializeProject } from "../utils/serialization";
import { generateId } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  FileText,
  FolderOpen,
  Save,
  Download,
  ChevronDown,
  Plus,
} from "lucide-react";

export function ProjectMenu() {
  const [showNewConfirm, setShowNewConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const metadata = useStore((s) => s.metadata);
  const setProjectMetadata = useStore((s) => s.setProjectMetadata);
  const markClean = useStore((s) => s.markClean);
  const characters = useStore((s) => s.characters);

  const restoreSnapshot = useCanvasStore((s) => s.restoreSnapshot);
  const clearCanvas = useCanvasStore((s) => s.clearCanvas);

  // ── New Project ──────────────────────────────────────────────────────────

  const handleNewProject = () => {
    clearCanvas();
    setProjectMetadata({
      id: generateId(),
      name: "Untitled Story",
      description: "",
      author: "",
      version: "0.1.0",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setShowNewConfirm(false);
  };

  // ── Save ─────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!metadata) return;
    setIsSaving(true);

    const { nodes, edges } = useCanvasStore.getState();
    const project = serializeProject(metadata, nodes, edges, characters);
    const result = await persistence.saveAs(project);

    if (result.success) {
      markClean();
      await persistence.clearAutosave();
    }
    setIsSaving(false);
  };

  // ── Open ─────────────────────────────────────────────────────────────────

  const handleOpen = async () => {
    const project = await persistence.open();
    if (!project) return;

    setProjectMetadata(project.metadata);
    restoreSnapshot(
      project.nodes as never,
      project.edges as never
    );

    // Restore characters
    const setCharacters = useStore.setState;
    setCharacters({ characters: project.characters });

    markClean();
  };

  // ── Export JSON (always available, even mid-edit) ──────────────────────

  const handleExportJson = async () => {
    if (!metadata) return;
    const { nodes, edges } = useCanvasStore.getState();
    const project = serializeProject(metadata, nodes, edges, characters);
    await persistence.saveAs(project); // same mechanism — browser downloads JSON
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-accent transition-colors"
            )}
          >
            <FileText size={13} />
            File
            <ChevronDown size={11} />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            sideOffset={4}
            className={cn(
              "z-50 min-w-[200px] p-1 rounded-lg shadow-xl",
              "bg-card border border-border",
              "animate-fade-in"
            )}
          >
            <DropdownMenu.Item
              onClick={() => setShowNewConfirm(true)}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm",
                "text-foreground cursor-pointer outline-none",
                "data-[highlighted]:bg-accent"
              )}
            >
              <Plus size={13} />
              New Project
            </DropdownMenu.Item>

            <DropdownMenu.Item
              onClick={handleOpen}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm",
                "text-foreground cursor-pointer outline-none",
                "data-[highlighted]:bg-accent"
              )}
            >
              <FolderOpen size={13} />
              Open Project...
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="my-1 h-px bg-border" />

            <DropdownMenu.Item
              onClick={handleSave}
              disabled={isSaving}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm",
                "text-foreground cursor-pointer outline-none",
                "data-[highlighted]:bg-accent",
                "data-[disabled]:opacity-50"
              )}
            >
              <Save size={13} />
              {isSaving ? "Saving..." : "Save"}
              <span className="ml-auto text-[10px] text-muted-foreground font-mono">
                Ctrl+S
              </span>
            </DropdownMenu.Item>

            <DropdownMenu.Item
              onClick={handleExportJson}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm",
                "text-foreground cursor-pointer outline-none",
                "data-[highlighted]:bg-accent"
              )}
            >
              <Download size={13} />
              Export as JSON
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* New Project confirmation */}
      <Dialog.Root open={showNewConfirm} onOpenChange={setShowNewConfirm}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
          <Dialog.Content
            className={cn(
              "fixed z-50 top-1/2 left-1/2",
              "-translate-x-1/2 -translate-y-1/2",
              "w-full max-w-sm p-5 rounded-xl",
              "bg-card border border-border shadow-2xl"
            )}
          >
            <Dialog.Title className="text-sm font-semibold text-foreground mb-2">
              Start New Project?
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground mb-4">
              Unsaved changes to the current project will be lost. Consider
              saving first.
            </Dialog.Description>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowNewConfirm(false)}
                className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleNewProject}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                New Project
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}