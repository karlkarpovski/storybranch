// src/features/search/components/SearchPanel.tsx
import { useRef, useEffect } from "react";
import { useSearch } from "../hooks/useSearch";
import { SearchResult } from "./SearchResult";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

export function SearchPanel() {
  const { query, setQuery, results, focusNode } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when panel opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Search input */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search scenes, dialogue, notes..."
            className={cn(
              "w-full pl-7 pr-7 py-1.5 rounded-md text-xs",
              "bg-muted border border-border",
              "text-foreground placeholder:text-muted-foreground",
              "outline-none focus:border-primary transition-colors"
            )}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Result count */}
        {query.length >= 2 && (
          <p className="text-[10px] text-muted-foreground mt-1.5">
            {results.length === 0
              ? "No results found"
              : `${results.length} result${results.length === 1 ? "" : "s"}`}
          </p>
        )}
      </div>

      {/* Results list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {query.length < 2 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <Search size={20} className="text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground text-center">
              Type at least 2 characters to search
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <p className="text-xs text-muted-foreground text-center">
              No matches for{" "}
              <span className="text-foreground font-medium">"{query}"</span>
            </p>
          </div>
        ) : (
          results.map((result) => (
            <SearchResult
              key={result.id}
              result={result}
              query={query}
              onClick={() => focusNode(result.nodeId)}
            />
          ))
        )}
      </div>
    </div>
  );
}