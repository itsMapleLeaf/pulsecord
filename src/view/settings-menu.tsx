import { Newline, Text } from "ink"
import React, { useState } from "react"
import {
  ButtonInput,
  CheckboxInput,
  FocusableList,
  LabeledTextInput,
} from "./focusable-list"
import { MenuScreenLayout } from "./menu-screen-layout"
import { useStores } from "./store-context.js"

export function SettingsMenu() {
  const stores = useStores()
  const [changeCount, setChangeCount] = useState(0)

  return (
    <>
      <MenuScreenLayout.Section>
        <FocusableList>
          <LabeledTextInput
            label="Bot Token"
            sensitive
            onChange={(value) => {
              stores.botStore.botToken.set(value)
              setChangeCount(changeCount + 1)
            }}
            value={stores.botStore.botToken.get() ?? ""}
          />
          <LabeledTextInput
            label="User ID"
            onChange={(value) => {
              stores.botStore.userId.set(value)
              setChangeCount(changeCount + 1)
            }}
            value={stores.botStore.userId.get()}
          />
          <LabeledTextInput
            label="Guild ID"
            onChange={(value) => {
              stores.botStore.guildId.set(value)
              setChangeCount(changeCount + 1)
            }}
            value={stores.botStore.guildId.get()}
          />
          <CheckboxInput
            label="Notify on source change (not working yet)"
            value={stores.notificationStore.enabled.get()}
            onChange={(value) => {
              stores.notificationStore.enabled.set(value)
              setChangeCount(changeCount + 1)
            }}
          />
          <Newline count={1} />
          <ButtonInput
            onPress={() => stores.routerStore.setScreen("main")}
            label="Back"
          />
        </FocusableList>
        {changeCount > 0 && (
          <Text color="green">
            Settings saved! {changeCount > 1 && `(${changeCount})`}
          </Text>
        )}
      </MenuScreenLayout.Section>
    </>
  )
}
