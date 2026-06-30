// src/features/project/adapters/index.ts
// Picks the right adapter at runtime — this is the only file
// the rest of the app should import from.

import { isTauriEnvironment } from "./persistenceAdapter";
import { browserAdapter } from "./browserAdapter";
import { tauriAdapter } from "./tauriAdapter";
import type { PersistenceAdapter } from "./persistenceAdapter";

export const persistence: PersistenceAdapter = isTauriEnvironment()
  ? tauriAdapter
  : browserAdapter;

export type { ProjectFile } from "@/types";