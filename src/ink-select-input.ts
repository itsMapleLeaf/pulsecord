import type SelectInputType from "ink-select-input"
import { createRequire } from "module"

const require = createRequire(import.meta.url)

export const SelectInput: typeof SelectInputType =
  require("ink-select-input").default
