import { Text } from "ink"
import { observer } from "mobx-react-lite"
import * as React from "react"
import { SelectInput } from "../ink-select-input.js"
import type { PulseStore } from "../stores/pulse-store.js"
import type { RouterStore } from "../stores/router-store.js"
import { AudioSourceMenu } from "./application-menu.jsx"
import { MenuScreenLayout } from "./menu-screen-layout.jsx"

export const RootScreen = observer(function RootScreen({
  pulseStore,
  routerStore,
  onQuit,
}: {
  pulseStore: PulseStore
  routerStore: RouterStore
  onQuit: () => void
}) {
  if (routerStore.screen === "main") {
    return (
      <MenuScreenLayout>
        <MenuScreenLayout.Title>
          PulseCord
          {pulseStore.sources.current ? (
            <Text color="gray" bold={false}>
              {" - "}Playing from{" "}
              <Text bold color="white">
                {pulseStore.sources.current?.name}
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
                value: () => routerStore.setScreen("selectSource"),
              },
              {
                key: "settings",
                label: "Settings",
                value: () => routerStore.setScreen("settings"),
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

  if (routerStore.screen === "selectSource") {
    return (
      <MenuScreenLayout>
        <MenuScreenLayout.Title>Select Audio Source</MenuScreenLayout.Title>
        <MenuScreenLayout.ListSection>
          <AudioSourceMenu routerStore={routerStore} pulseStore={pulseStore} />
        </MenuScreenLayout.ListSection>
      </MenuScreenLayout>
    )
  }

  if (routerStore.screen === "settings") {
    return (
      <MenuScreenLayout>
        <MenuScreenLayout.Title>Settings</MenuScreenLayout.Title>
        <MenuScreenLayout.ListSection>
          <Text>:)</Text>
        </MenuScreenLayout.ListSection>
      </MenuScreenLayout>
    )
  }

  return <></>
})
