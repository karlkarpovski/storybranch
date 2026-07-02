// src/features/assets/components/AssetManager.tsx
import { cn } from "@/lib/utils";
import { Image, Music, FolderOpen } from "lucide-react";

const ASSET_CATEGORIES = [
  { label: "Backgrounds", icon: Image,  count: 0 },
  { label: "Portraits",   icon: Image,  count: 0 },
  { label: "CGs",         icon: Image,  count: 0 },
  { label: "BGM",         icon: Music,  count: 0 },
  { label: "SFX",         icon: Music,  count: 0 },
  { label: "Voice",       icon: Music,  count: 0 },
];

export function AssetManager() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-3">
        <p className="text-xs text-muted-foreground mb-3">
          Asset browser available after project save (Phase 7).
        </p>

        <div className="space-y-1">
          {ASSET_CATEGORIES.map(({ label, icon: Icon, count }) => (
            <div
              key={label}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md",
                "text-sm text-muted-foreground",
                "hover:bg-accent hover:text-foreground",
                "transition-colors cursor-pointer"
              )}
            >
              <Icon size={14} />
              <span className="flex-1">{label}</span>
              <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-border">
        <button
          className={cn(
            "w-full flex items-center justify-center gap-2",
            "py-2 rounded-md text-sm",
            "bg-muted text-muted-foreground",
            "hover:bg-accent hover:text-foreground transition-colors"
          )}
        >
          <FolderOpen size={14} />
          Open Assets Folder
        </button>
      </div>
    </div>
  );
}