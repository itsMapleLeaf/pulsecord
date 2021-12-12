import { Box, render } from "ink"
import * as React from "react"
import { Bot } from "./bot.js"
import { FileLogger } from "./logger.js"
import { Store } from "./store.js"
import { RootScreen } from "./view/root-screen.js"

const logger = new FileLogger("debug.log")

const store = new Store(logger)
await store.init()

const bot = new Bot(logger, store)
await bot.run()

const view = render(
  <Box borderStyle="single" borderColor="blue" paddingX={1} paddingY={1}>
    <RootScreen store={store} onQuit={() => view.unmount()} />
  </Box>,
)
await view.waitUntilExit()

bot.leave()
await store.quit()
