import { contextBridge, ipcRenderer } from "electron"
import type { AudioSource } from "./pulseaudio"

type DesktopApiType = typeof desktopApi

const desktopApi = {
  subscribeToAudioSources: (callback: (sources: AudioSource[]) => void) => {
    const listener = (
      event: Electron.IpcRendererEvent,
      sources: AudioSource[],
    ) => callback(sources)

    ipcRenderer.on("audioSources", listener)
    return () => {
      ipcRenderer.removeListener("audioSources", listener)
    }
  },
}

contextBridge.exposeInMainWorld("desktopApi", desktopApi)

declare global {
  var desktopApi: DesktopApiType
}
