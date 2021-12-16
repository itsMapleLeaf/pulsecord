import envPaths from "env-paths"
import { action, computed, makeObservable, observable } from "mobx"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { checkJsonIsRecord, parseJsonSafe } from "./helpers/parse-json-safe"
import type { Json } from "./helpers/types"

const configFolder = envPaths("pulsecord").config
const configFile = join(configFolder, "config.json")

await mkdir(configFolder, { recursive: true })
if (!existsSync(configFile)) {
  await writeFile(configFile, JSON.stringify({}, undefined, 2))
}

function getSetting<T>(key: string): T | undefined {
  const json = parseJsonSafe(readFileSync(configFile, "utf8"))
  if (!checkJsonIsRecord(json)) {
    return undefined
  }
  return json[key] as unknown as T
}

function writeSetting(key: string, value: Json) {
  let json = parseJsonSafe(readFileSync(configFile, "utf8"))
  if (!checkJsonIsRecord(json)) {
    json = {}
  }
  json[key] = value
  writeFileSync(configFile, JSON.stringify(json, undefined, 2))
}

export class Setting<Type extends Json> {
  internalValue: Type

  constructor(private settingKey: string, defaultValue: Type) {
    this.internalValue = getSetting<Type>(settingKey) ?? defaultValue
    makeObservable(this, {
      internalValue: observable,
      value: computed,
      set: action.bound,
    })
  }

  get value() {
    return this.internalValue
  }

  set(value: Type) {
    this.internalValue = value
    writeSetting(this.settingKey, value)
  }
}
