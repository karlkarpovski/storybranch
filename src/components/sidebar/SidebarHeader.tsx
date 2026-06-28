// src/components/sidebar/SidebarHeader.tsx
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  title: string;
  description?: string;
}

export function SidebarHeader({ title, description }: SidebarHeaderProps) {
  return (
    <div className="px-4 py-3 border-b border-border shrink-0">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {description && (
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      )}
    </div>
  );
}