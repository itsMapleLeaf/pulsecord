import { Newline, Text, useFocus, useInput } from "ink"
import React, { useState } from "react"
import type { RouterStore } from "../stores/router-store"
import { MenuScreenLayout } from "./menu-screen-layout"

export function SettingsMenu({ routerStore }: { routerStore: RouterStore }) {
  const [a, setA] = useState("hi")
  const [b, setB] = useState(":)")
  const [changed, setChanged] = useState(0)

  return (
    <>
      <MenuScreenLayout.Section>
        <SettingItem
          label="helo"
          value={a}
          onChange={(value) => {
            setA(value)
            setChanged(changed + 1)
          }}
        />
        <SettingItem
          label="hi!"
          value={b}
          onChange={(value) => {
            setB(value)
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
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const { isFocused } = useFocus()

  const [internalValue, setInternalValue] = useState<string | undefined>()

  useInput(
    (input, key) => {
      if (key.return) {
        if (internalValue != undefined) {
          onChange(internalValue)
          setInternalValue(undefined)
        } else setInternalValue(value)

        return
      }

      if (key.tab && internalValue != undefined) {
        onChange(internalValue)
        setInternalValue(undefined ?? undefined)
        return
      }

      if (key.backspace && internalValue != undefined) {
        setInternalValue(internalValue.slice(0, -1))
      }

      if (internalValue == undefined) return

      if (key.backspace) {
        setInternalValue(internalValue + "delete")
      } else setInternalValue(internalValue + input)
    },
    { isActive: isFocused },
  )

  const color = isFocused ? "blue" : "white"
  const bold = isFocused ? true : false

  return (
    <Text>
      <Text bold={bold} color={color}>
        {label}
      </Text>
      : {internalValue || value}
      {internalValue != undefined && <Text underline> </Text>}
    </Text>
  )
}
