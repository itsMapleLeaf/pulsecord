import { Text } from "ink"
import { observer } from "mobx-react-lite"
import * as React from "react"
import { AudioSourceMenu } from "./application-menu.jsx"
import { MainMenu } from "./main-menu"
import { MenuScreenLayout } from "./menu-screen-layout.jsx"
import { SettingsMenu } from "./settings-menu.js"
import { useStores } from "./store-context.js"

export const RootScreen = observer(function RootScreen({
  onQuit,
}: {
  onQuit: () => void
}) {
  const stores = useStores()
  if (stores.routerStore.screen === "main") {
    return (
      <MenuScreenLayout>
        <MenuScreenLayout.Title>
          PulseCord
          {stores.pulseStore.currentAudioSource ? (
            <Text color="gray" bold={false}>
              {" - "}Playing from{" "}
              <Text bold color="white">
                {stores.pulseStore.currentAudioSource.name}
              </Text>
            </Text>
          ) : (
            <Text color="gray" bold={false}>
              {" - "}No source selected
            </Text>
          )}
        </MenuScreenLayout.Title>
        <MenuScreenLayout.ListSection>
          <MainMenu onQuit={onQuit} />
        </MenuScreenLayout.ListSection>
      </MenuScreenLayout>
    )
  }

  if (stores.routerStore.screen === "selectSource") {
    return (
      <MenuScreenLayout>
        <MenuScreenLayout.Title>Select Audio Source</MenuScreenLayout.Title>
        <MenuScreenLayout.ListSection>
          <AudioSourceMenu />
        </MenuScreenLayout.ListSection>
      </MenuScreenLayout>
    )
  }

  if (stores.routerStore.screen === "settings") {
    return (
      <MenuScreenLayout>
        <MenuScreenLayout.Title>Settings</MenuScreenLayout.Title>
        <MenuScreenLayout.ListSection>
          <SettingsMenu />
        </MenuScreenLayout.ListSection>
      </MenuScreenLayout>
    )
  }

  return <></>
})
