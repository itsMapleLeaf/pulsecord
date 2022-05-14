import { createRemixBrowserWindow, initRemix } from "@remix-electron/main"
import { app } from "electron"
import { join } from "path"

app.on("ready", async () => {
  await initRemix()

  const win = await createRemixBrowserWindow({
    initialRoute: "/",
    icon: join(__dirname, "../public/icon.png"),
    show: false,
  })

  win.show()

  if (process.env.NODE_ENV === "development") {
    win.webContents.openDevTools()
  }
})
