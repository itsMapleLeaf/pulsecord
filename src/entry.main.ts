import { app, dialog } from "electron"
import { PulseAudio } from "pulseaudio.js"
import { getErrorStack } from "./common/errors"
import { typedIpcMain } from "./electron/ipc-main-api"
import { createWindow } from "./electron/window"
import { getAudioSources } from "./pulseaudio/audio-source"

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
