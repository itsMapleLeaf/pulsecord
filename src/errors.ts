export function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error))
}

export function raise(error: unknown): never {
  throw toError(error)
}
