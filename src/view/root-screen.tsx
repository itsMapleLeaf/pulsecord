import { Text } from "ink"
import { observer } from "mobx-react-lite"
import * as React from "react"
import { SelectInput } from "../ink-select-input.js"
import type { Store } from "../store.js"
import { AudioSourceMenu } from "./application-menu.jsx"
import { MenuScreenLayout } from "./menu-screen-layout.jsx"

export const RootScreen = observer(function RootScreen({
  store,
  onQuit,
}: {
  store: Store
  onQuit: () => void
}) {
  if (store.screen === "main") {
    return (
      <MenuScreenLayout>
        <MenuScreenLayout.Title>
          PulseCord
          {store.sources.current ? (
            <Text color="gray" bold={false}>
              {" - "}Playing from{" "}
              <Text bold color="white">
                {store.sources.current?.name}
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
                value: onQuit,
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

  return <></>
})
