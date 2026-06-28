// src/features/characters/components/CharacterManager.tsx
import { useState, useMemo } from "react";
import { useStore } from "@/store";
import { CharacterCard } from "./CharacterCard";
import { CharacterForm } from "./CharacterForm";
import { cn } from "@/lib/utils";
import type { Character } from "@/types";
import { Plus, Search, Users } from "lucide-react";

export function CharacterManager() {
  const characters = useStore((s) => s.characters);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(
    null
  );

  const characterList = useMemo(
    () => Object.values(characters),
    [characters]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return characterList;
    const q = search.toLowerCase();
    return characterList.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [characterList, search]);

  const handleEdit = (character: Character) => {
    setEditingCharacter(character);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingCharacter(null);
    setFormOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search characters..."
            className={cn(
              "w-full pl-7 pr-3 py-1.5 rounded-md text-xs",
              "bg-muted border border-border",
              "text-foreground placeholder:text-muted-foreground",
              "outline-none focus:border-primary transition-colors"
            )}
          />
        </div>
      </div>

      {/* Character list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <Users size={24} className="text-muted-foreground/50" />
            <p className="text-xs text-muted-foreground text-center">
              {search ? "No characters found" : "No characters yet"}
            </p>
          </div>
        ) : (
          filtered.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>

      {/* Add button */}
      <div className="p-3 border-t border-border">
        <button
          onClick={handleAdd}
          className={cn(
            "w-full flex items-center justify-center gap-2",
            "py-2 rounded-md text-sm font-medium",
            "bg-primary/10 text-primary border border-primary/20",
            "hover:bg-primary/20 transition-colors"
          )}
        >
          <Plus size={14} />
          New Character
        </button>
      </div>

      {/* Form dialog */}
      <CharacterForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingCharacter(null);
        }}
        initial={editingCharacter}
      />
    </div>
  );
}