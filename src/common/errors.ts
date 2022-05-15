export function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value))
}

export function raise(error: unknown): never {
  throw toError(error)
}

export function getErrorStack(error: unknown) {
  return error instanceof Error ? error.stack || error.message : String(error)
}
