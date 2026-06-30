// src/features/project/components/AutosaveIndicator.tsx
import { cn } from "@/lib/utils";
import type { AutosaveStatus } from "../hooks/useAutosave";
import { Check, Loader2, AlertCircle } from "lucide-react";

interface AutosaveIndicatorProps {
  status: AutosaveStatus;
}

export function AutosaveIndicator({ status }: AutosaveIndicatorProps) {
  if (status === "idle") return null;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs",
        "animate-fade-in",
        status === "saved" && "text-green-500",
        status === "saving" && "text-muted-foreground",
        status === "error" && "text-destructive"
      )}
    >
      {status === "saving" && <Loader2 size={11} className="animate-spin" />}
      {status === "saved" && <Check size={11} />}
      {status === "error" && <AlertCircle size={11} />}
      <span>
        {status === "saving" && "Saving..."}
        {status === "saved" && "Saved"}
        {status === "error" && "Autosave failed"}
      </span>
    </div>
  );
}