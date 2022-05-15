import type { IpcMainEvent, IpcRendererEvent, WebContents } from "electron"
import type { BotConfig } from "../discord/discord-bot"
import type { AudioSource } from "../pulseaudio/audio-source"

type IpcRendererEventMap = {
  audioSources: [sources: AudioSource[]]
}

type IpcMainEventMap = {}

type IpcHandlerMap = {
  getBotConfig: () => BotConfig | undefined
  setBotConfig: (config: BotConfig) => void
}

type TypedIpcRendererApi = {
  subscribe: <EventName extends keyof IpcRendererEventMap>(
    event: EventName,
    callback: (
      event: IpcRendererEvent,
      ...args: IpcRendererEventMap[EventName]
    ) => void,
  ) => () => void

  send: <EventName extends keyof IpcMainEventMap>(
    event: EventName,
    ...args: IpcMainEventMap[EventName]
  ) => void

  invoke: <Handler extends keyof IpcHandlerMap>(
    handler: Handler,
    ...args: Parameters<IpcHandlerMap[Handler]>
  ) => Promise<ReturnType<IpcHandlerMap[Handler]>>
}

type TypedIpcMainApi = {
  send: <EventName extends keyof IpcRendererEventMap>(
    webContents: WebContents,
    event: EventName,
    ...args: IpcRendererEventMap[EventName]
  ) => void

  subscribe: <EventName extends keyof IpcMainEventMap>(
    event: EventName,
    callback: (
      event: IpcMainEvent,
      ...args: IpcMainEventMap[EventName]
    ) => void,
  ) => () => void

  handle: <Handler extends keyof IpcHandlerMap>(
    handler: Handler,
    callback: (
      event: IpcMainEvent,
      ...args: Parameters<IpcHandlerMap[Handler]>
    ) => MaybePromise<ReturnType<IpcHandlerMap[Handler]>>,
  ) => void
}

type MaybePromise<T> = T | Promise<T>

export function createIpcRendererApi() {
  const { ipcRenderer } = require("electron")

  return {
    subscribe: (
      event: string,
      callback: (event: IpcRendererEvent, ...args: any[]) => void,
    ) => {
      ipcRenderer.on(event, callback)
      return () => {
        ipcRenderer.off(event, callback)
      }
    },

    send: (event: string, ...args: any[]) => {
      ipcRenderer.send(event, ...args)
    },

    invoke: (event: string, ...args: any[]) => {
      return ipcRenderer.invoke(event, ...args)
    },
  } as TypedIpcRendererApi
}

export function createIpcMainApi() {
  const { ipcMain } = require("electron")

  return {
    send: (webContents: WebContents, event: string, ...args: any[]) => {
      webContents.send(event, ...args)
    },

    subscribe: (
      event: string,
      callback: (event: IpcMainEvent, ...args: any[]) => void,
    ) => {
      ipcMain.on(event, callback)
      return () => {
        ipcMain.off(event, callback)
      }
    },

    handle: (handler: string, callback: (...args: any[]) => any) => {
      ipcMain.handle(handler, callback)
    },
  } as TypedIpcMainApi
}
