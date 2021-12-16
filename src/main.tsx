import { Box, render } from "ink"
import * as React from "react"
import { RootScreen } from "./view/root-screen.js"
import { createStores, StoresProvider } from "./view/store-context.js"

const stores = createStores()

await stores.pulseStore.init()

const view = render(
  <Box borderStyle="single" borderColor="blue" paddingX={1} paddingY={1}>
    <StoresProvider {...stores}>
      <RootScreen onQuit={() => view.unmount()} />
    </StoresProvider>
  </Box>,
)
await view.waitUntilExit()

stores.botStore.leave()
await stores.pulseStore.disconnect()
