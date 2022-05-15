import type { BrowserWindow } from "electron"
import { screen } from "electron"
import ElectronStore from "electron-store"
import { z } from "zod"

const store = new ElectronStore<{ windowState: undefined }>()

const windowStateSchema = z.object({
  bounds: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
  }),
  isMaximized: z.boolean(),
})
type WindowState = z.infer<typeof windowStateSchema>

export function loadWindowState(): WindowState {
  const result = windowStateSchema.safeParse(store.get("windowState"))
  if (result.success) return result.data

  const width = 400
  const height = 600
  const displayBounds = screen.getPrimaryDisplay().bounds
  const x = Math.round((displayBounds.width - width) / 2)
  const y = Math.round((displayBounds.height - height) / 2)

  return {
    bounds: { x, y, width, height },
    isMaximized: false,
  }
}

export function persistWindowState(win: BrowserWindow) {
  let state: WindowState = {
    bounds: win.getBounds(),
    isMaximized: win.isMaximized(),
  }

  const handleWindowStateChange = debounce(() => {
    if (win.isMaximized()) {
      state.isMaximized = true
    } else {
      state.bounds = win.getBounds()
      state.isMaximized = false
    }
    store.set("windowState", state)
  }, 500)

  win.on("move", handleWindowStateChange)
  win.on("resize", handleWindowStateChange)
  win.on("maximize", handleWindowStateChange)
  win.on("unmaximize", handleWindowStateChange)
}

function debounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  ms: number,
) {
  let timer: NodeJS.Timeout | undefined
  return (...args: Args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      callback(...args)
      timer = undefined
    }, ms)
  }
}
