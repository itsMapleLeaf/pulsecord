import { app, dialog } from "electron"
import { PulseAudio } from "pulseaudio.js"
import { getErrorStack } from "./common/errors"
import { DesktopAudioPlayer } from "./discord/desktop-audio-player"
import { Bot } from "./discord/discord-bot"
import { typedIpcMain } from "./electron/ipc-main-api"
import { createWindow } from "./electron/window"
import { getAudioSources } from "./pulseaudio/audio-source"

const pulse = new PulseAudio()

const player = new DesktopAudioPlayer()
typedIpcMain.handle("setAudioSource", (event, source) => {
  player.setAudioSource(source)
})

const bot = new Bot(player)
typedIpcMain.handle("getBotConfig", async () => bot.config)
typedIpcMain.handle("setBotConfig", (event, config) => bot.setConfig(config))

app.on("ready", async () => {
  try {
    await pulse.connect()
    await bot.init()

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

app.on("window-all-closed", () => {
  app.quit()
})

app.on("before-quit", () => {
  bot.destroyClient()
})
