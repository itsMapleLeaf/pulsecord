import { Newline, Text } from "ink"
import React, { useState } from "react"
import { Setting } from "../setting"
import type { RouterStore } from "../stores/router-store"
import {
  ButtonInput,
  CheckboxInput,
  FocusableList,
  LabeledTextInput,
} from "./focusable-list"
import { MenuScreenLayout } from "./menu-screen-layout"

export function SettingsMenu({ routerStore }: { routerStore: RouterStore }) {
  const botToken = new Setting<string>("botToken", "")
  const userId = new Setting<string>("userId", "")
  const notify = new Setting<boolean>("notify", false)
  const guildId = new Setting<string>("guildId", "")

  const [changed, setChanged] = useState(0)

  return (
    <>
      <MenuScreenLayout.Section>
        <FocusableList>
          <LabeledTextInput
            label="Bot Token"
            sensitive
            onChange={(value) => {
              botToken.set(value)
              setChanged(changed + 1)
            }}
            value={botToken.get()}
          />
          <LabeledTextInput
            label="User ID"
            onChange={(value) => {
              userId.set(value)
              setChanged(changed + 1)
            }}
            value={userId.get()}
          />
          <LabeledTextInput
            label="Guild ID"
            onChange={(value) => {
              guildId.set(value)
              setChanged(changed + 1)
            }}
            value={guildId.get()}
          />
          <CheckboxInput
            label="Notify on source change"
            value={notify.get()}
            onChange={(value) => {
              notify.set(value)
              setChanged(changed + 1)
            }}
          />
          <Newline count={1} />
          <ButtonInput
            onPress={() => routerStore.setScreen("main")}
            label="Back"
          />
        </FocusableList>
        {!!changed && (
          <Text color="green">
            Settings saved! {changed > 1 && `(${changed})`}
          </Text>
        )}
      </MenuScreenLayout.Section>
    </>
  )
}
