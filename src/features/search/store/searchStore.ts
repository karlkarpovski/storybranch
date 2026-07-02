// src/features/search/store/searchStore.ts
import { create } from "zustand";

interface SearchStore {
  highlightedNodeId: string | null;
  setHighlightedNodeId: (id: string | null) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  highlightedNodeId: null,
  setHighlightedNodeId: (id) => set({ highlightedNodeId: id }),
}));