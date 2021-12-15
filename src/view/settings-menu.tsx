import { Newline, Text, useFocus } from "ink"
import React, { useState } from "react"
import { TextInput } from "../ink-text-input"
import { Setting } from "../setting"
import type { RouterStore } from "../stores/router-store"
import { MenuScreenLayout } from "./menu-screen-layout"

export function SettingsMenu({ routerStore }: { routerStore: RouterStore }) {
  const botToken = new Setting<string>("botToken", "")
  const userId = new Setting<string>("userId", "")
  const guildId = new Setting<string>("guildId", "")

  const [changed, setChanged] = useState(0)

  return (
    <>
      <MenuScreenLayout.Section>
        <SettingItem
          sensitive
          label="Bot Token"
          value={botToken.get()}
          onChange={(value) => {
            botToken.set(value)
            setChanged(changed + 1)
          }}
        />
        <SettingItem
          label="User ID"
          value={userId.get()}
          onChange={(value) => {
            userId.set(value)
            setChanged(changed + 1)
          }}
        />
        <SettingItem
          label="Guild ID"
          value={guildId.get()}
          onChange={(value) => {
            guildId.set(value)
            setChanged(changed + 1)
          }}
        />

        {!!changed && (
          <Text color="green">
            <Newline />
            Settings saved! {changed > 1 && `(${changed})`}
          </Text>
        )}
      </MenuScreenLayout.Section>
    </>
  )
}

function SettingItem({
  label,
  value,
  onChange,
  sensitive,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  sensitive?: boolean
}) {
  const { isFocused } = useFocus()

  const [internalValue, setInternalValue] = useState<string>(value)

  const color = isFocused ? "blue" : "white"
  const bold = isFocused ? true : false

  return (
    <>
      <Text bold={bold} color={color}>
        {label}:{" "}
        <TextInput
          focus={isFocused}
          value={internalValue}
          placeholder="None"
          onChange={setInternalValue}
          mask={!((!isFocused && !sensitive) || isFocused) ? "*" : undefined}
          onSubmit={onChange}
        />
      </Text>
    </>
  )
}
