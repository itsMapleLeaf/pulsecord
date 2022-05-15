import { app, dialog } from "electron"
import { PulseAudio } from "pulseaudio.js"
import { getErrorStack } from "./errors"
import { typedIpcMain } from "./ipc-main-api"
import { getAudioSources } from "./pulseaudio"
import { createWindow } from "./window"

app.on("ready", async () => {
  try {
    const pulse = new PulseAudio()
    await pulse.connect()

    const win = await createWindow()

    const publishSources = async () => {
      try {
        typedIpcMain.send(
          win.webContents,
          "audioSources",
          await getAudioSources(pulse),
        )
      } catch (error) {
        console.error(error)
      }
    }

    win.on("ready-to-show", publishSources)
    pulse.on("event.sink_input.new", publishSources)
    pulse.on("event.sink_input.changed", publishSources)
    pulse.on("event.sink_input.remove", publishSources)
  } catch (error) {
    dialog.showErrorBox("Error creating window", getErrorStack(error))
  }
})
