import { contextBridge } from "electron"
import { createIpcRendererApi } from "./typed-ipc"

const api = createIpcRendererApi()
contextBridge.exposeInMainWorld("typedIpc", api)

declare global {
  var typedIpc: typeof api
}
