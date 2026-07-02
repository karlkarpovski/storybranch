// src/features/search/types.ts

export type SearchResultType =
  | "scene"
  | "description"
  | "dialogue"
  | "note"
  | "character";

export interface SearchResult {
  id: string;           // unique result id
  nodeId: string;       // canvas node id to focus (empty for characters)
  type: SearchResultType;
  title: string;        // primary label e.g. scene name
  excerpt: string;      // matched text snippet
  matchedField: string; // human label e.g. "Scene Name", "Dialogue"
}