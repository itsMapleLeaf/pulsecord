import { mkdirSync, writeFileSync } from "node:fs"
import { appendFile } from "node:fs/promises"
import { dirname } from "node:path"
import { toError } from "./helpers/errors.js"

export type Logger = {
  info: (...values: unknown[]) => void
  warn: (...values: unknown[]) => void
  error: (...values: unknown[]) => void
  errorStack: (prefix: string, error: unknown) => void
}

export class FileLogger implements Logger {
  constructor(private filePath: string) {
    mkdirSync(dirname(filePath), { recursive: true })
    writeFileSync(this.filePath, "")
  }

  private log(...values: unknown[]) {
    const timestamp = `[${new Date().toLocaleString()}]`
    void appendFile(this.filePath, [timestamp, ...values].join("\t") + "\n")
  }

  info(...values: unknown[]) {
    this.log("[info]", ...values)
  }

  warn(...values: unknown[]) {
    this.log("[warn]", ...values)
  }

  error(...values: unknown[]) {
    this.log("[error]", ...values)
  }

  errorStack(prefix: string, error: unknown) {
    const { stack, message } = toError(error)
    this.log("[error]", prefix, stack || message)
  }
}
