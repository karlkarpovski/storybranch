// src/features/search/components/SearchResult.tsx
import { cn } from "@/lib/utils";
import type { SearchResult as SearchResultType } from "../types";
import {
  FileText,
  AlignLeft,
  MessageSquare,
  StickyNote,
  User,
} from "lucide-react";

interface SearchResultProps {
  result: SearchResultType;
  query: string;
  onClick: () => void;
}

const TYPE_CONFIG = {
  scene:       { icon: FileText,      color: "text-primary"        },
  description: { icon: AlignLeft,     color: "text-blue-400"       },
  dialogue:    { icon: MessageSquare, color: "text-green-400"      },
  note:        { icon: StickyNote,    color: "text-yellow-400"     },
  character:   { icon: User,          color: "text-pink-400"       },
};

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-primary/30 text-primary rounded-sm px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function SearchResult({ result, query, onClick }: SearchResultProps) {
  const config = TYPE_CONFIG[result.type];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2.5 rounded-lg",
        "border border-border hover:border-primary/30",
        "bg-card hover:bg-accent/30",
        "transition-all group",
        "flex items-start gap-2.5"
      )}
    >
      {/* Type icon */}
      <div className={cn("mt-0.5 shrink-0", config.color)}>
        <Icon size={13} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-xs font-medium text-foreground truncate">
            {result.title}
          </span>
          <span
            className={cn(
              "text-[10px] px-1 py-0.5 rounded shrink-0",
              "bg-muted text-muted-foreground"
            )}
          >
            {result.matchedField}
          </span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {highlightMatch(result.excerpt, query)}
        </p>
      </div>
    </button>
  );
}