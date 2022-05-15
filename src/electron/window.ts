import { app, BrowserWindow } from "electron"
import { join } from "node:path"
import { loadWindowState, persistWindowState } from "./window-state"

export async function createWindow() {
  const { bounds, isMaximized } = loadWindowState()

  const win = new BrowserWindow({
    ...bounds,
    show: false,
    frame: false,
    webPreferences: {
      preload: join(__dirname, "entry.preload.js"),
    },
  })

  win.on("ready-to-show", () => {
    if (isMaximized) win.maximize()
    win.show()
  })

  if (app.isPackaged || process.env.NODE_ENV === "production") {
    await win.loadFile(join(__dirname, "../renderer/index.html"))
  } else {
    await win.loadURL("http://localhost:3000")
    win.webContents.openDevTools()
  }

  persistWindowState(win)

  return win
}
