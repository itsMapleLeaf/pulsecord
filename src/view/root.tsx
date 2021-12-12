import { Box, Text } from "ink"
import { observer } from "mobx-react-lite"
import * as React from "react"
import { SelectInput } from "../ink-select-input.js"
import type { Store } from "../store.js"
import { AudioSourceMenu } from "./application-menu.jsx"
import { MenuScreenLayout } from "./menu-screen-layout.js"

export const Root = observer(function Root({ store }: { store: Store }) {
  return (
    <Box borderStyle="single" borderColor="blue" paddingX={1} paddingY={1}>
      <RootScreen store={store} />
    </Box>
  )
})

const RootScreen = observer(function RootScreen({ store }: { store: Store }) {
  if (store.screen === "main") {
    return (
      <MenuScreenLayout>
        <MenuScreenLayout.Title>
          PulseCord
          {store.sources.currentItem ? (
            <Text color="gray" bold={false}>
              {" - "}Playing from{" "}
              <Text bold color="white">
                {store.sources.currentItem?.name}
              </Text>
            </Text>
          ) : (
            <Text color="gray" bold={false}>
              {" - "}No source selected
            </Text>
          )}
        </MenuScreenLayout.Title>
        <MenuScreenLayout.ListSection>
          <SelectInput
            items={[
              {
                key: "selectApplication",
                label: "Select Audio Source",
                value: () => store.setScreen("selectSource"),
              },
              {
                key: "quit",
                label: "Quit",
                value: () => store.quit(),
              },
            ]}
            onSelect={(item) => item.value()}
          />
        </MenuScreenLayout.ListSection>
      </MenuScreenLayout>
    )
  }

  if (store.screen === "selectSource") {
    return (
      <MenuScreenLayout>
        <MenuScreenLayout.Title>Select Audio Source</MenuScreenLayout.Title>
        <MenuScreenLayout.ListSection>
          <AudioSourceMenu store={store} />
        </MenuScreenLayout.ListSection>
      </MenuScreenLayout>
    )
  }

  return null
})
