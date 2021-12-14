import { Box, render } from "ink"
import * as React from "react"
import { Bot } from "./bot.js"
import { FileLogger } from "./logger.js"
import { PulseStore } from "./stores/pulse-store.js"
import { RouterStore } from "./stores/router-store.js"
import { RootScreen } from "./view/root-screen.js"

const logger = new FileLogger("debug.log")

const pulseStore = new PulseStore(logger)
await pulseStore.init()

const routerStore = new RouterStore(logger)

const bot = new Bot(logger, pulseStore)
await bot.run()

const view = render(
  <Box borderStyle="single" borderColor="blue" paddingX={1} paddingY={1}>
    <RootScreen
      pulseStore={pulseStore}
      routerStore={routerStore}
      onQuit={() => view.unmount()}
    />
  </Box>,
)
await view.waitUntilExit()

bot.leave()
await pulseStore.disconnect()
