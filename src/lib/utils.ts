// src/lib/utils.ts
// The cn() helper merges Tailwind classes safely.
// This is the standard pattern from shadcn/ui.
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Generate a short unique ID — used for nodes, edges, characters, etc.
// We use crypto.randomUUID() rather than a library to keep bundle lean.
export function generateId(): string {
  return crypto.randomUUID();
}

// Format a date for display in the UI
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}