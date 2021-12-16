import React, { createContext } from "react"
import { raise } from "../helpers/errors.js"
import { FileLogger } from "../logger.js"
import { BotStore } from "../stores/bot-store.js"
import { NotificationStore } from "../stores/notification-store.js"
import { PulseStore } from "../stores/pulse-store.js"
import { RouterStore } from "../stores/router-store.js"

type Stores = ReturnType<typeof createStores>

export function createStores() {
  const logger = new FileLogger("debug.log")
  const pulseStore = new PulseStore(logger)
  const routerStore = new RouterStore(logger)
  const botStore = new BotStore(logger, pulseStore)
  const notificationStore = new NotificationStore()
  return {
    botStore,
    pulseStore,
    routerStore,
    notificationStore,
  }
}

const Context = createContext<Stores | undefined>(undefined)

export function StoresProvider(props: Stores & { children: React.ReactNode }) {
  return <Context.Provider value={props}>{props.children}</Context.Provider>
}

export function useStores() {
  return React.useContext(Context) ?? raise("Store provider not initialized")
}
