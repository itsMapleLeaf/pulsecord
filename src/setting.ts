import envPaths from "env-paths"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { checkJsonIsRecord, parseJsonSafe } from "./helpers/parse-json-safe"
import type { Json } from "./helpers/types"

export class Setting<Type extends Json | undefined> {
  private configDir = envPaths("pulsecord").config
  private configFile = this.configDir + "/config.json"

  constructor(private settingKey: string, private defaultValue: Type) {
    mkdirSync(this.configDir, { recursive: true })
    if (!existsSync(this.configFile)) {
      writeFileSync(this.configFile, JSON.stringify({}, undefined, 2))
    }
  }

  private get fileRecord(): Record<string, Json> | undefined {
    const fileData = parseJsonSafe(readFileSync(this.configFile, "utf8"))

    if (checkJsonIsRecord(fileData)) {
      return fileData
    }

    return undefined
  }

  get(): Type {
    if (this.fileRecord) {
      return (this.fileRecord[this.settingKey] as Type) ?? this.defaultValue
    }

    return this.defaultValue
  }

  set(value: Type) {
    const fileRecord: Record<string, Json | undefined> = this.fileRecord ?? {}

    fileRecord[this.settingKey] = value

    writeFileSync(this.configFile, JSON.stringify(fileRecord, undefined, 2))
  }
}
