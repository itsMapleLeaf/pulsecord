import type TextInputType from "ink-text-input"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
export const TextInput: typeof TextInputType = require("ink-text-input").default
