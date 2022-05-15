import { app, dialog } from "electron"
import { getErrorStack } from "./errors"
import { createWindow } from "./window"

app.on("ready", async () => {
  try {
    await createWindow()
  } catch (error) {
    dialog.showErrorBox("Error creating window", getErrorStack(error))
  }
})
