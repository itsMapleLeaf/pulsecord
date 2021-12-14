import type { Json } from "./types"

export function parseJsonSafe(json: string): Json | undefined {
  try {
    return JSON.parse(json)
  } catch {
    return undefined
  }
}

export function checkJsonIsRecord(
  json: Json | undefined,
): json is Record<string, Json> {
  return json != null && typeof json === "object" && !Array.isArray(json)
}
