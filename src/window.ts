import { app, BrowserWindow } from "electron"
import { join } from "node:path"

export async function createWindow() {
  const win = new BrowserWindow({
    show: false,
  })

  win.on("ready-to-show", () => {
    win.show()
  })

  if (app.isPackaged || process.env.NODE_ENV === "production") {
    await win.loadFile(join(__dirname, "../renderer/index.html"))
  } else {
    await win.loadURL("http://localhost:3000")
    win.webContents.openDevTools()
  }
}
