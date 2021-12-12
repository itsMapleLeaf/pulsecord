import type { Falsy } from "./types.js"

export function isTruthy<T>(value: T | Falsy): value is T {
  return !!value
}
