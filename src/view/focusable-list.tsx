import { Text, useFocus, useFocusManager, useInput } from "ink"
import React, { useEffect, useState } from "react"
import { TextInput } from "../ink-text-input"

export function FocusableList({
  children,
  orientation = "vertical",
}: {
  children: React.ReactNode
  orientation?: "horizontal" | "vertical"
}) {
  const { disableFocus, focusNext, focusPrevious } = useFocusManager()

  useEffect(() => {
    disableFocus()
  }, [disableFocus])

  useEffect(() => {
    focusNext()
    focusPrevious()
  }, [focusNext, focusPrevious])

  useInput((_, key) => {
    const next = orientation === "horizontal" ? key.rightArrow : key.downArrow
    const previous = orientation === "horizontal" ? key.leftArrow : key.upArrow

    if (next || key.tab) focusNext()
    if (previous || (key.shift && key.tab)) focusPrevious()
  })

  return <>{children}</>
}

export function CheckboxInput({
  value,
  onChange,
  label,
}: {
  value: boolean
  onChange: (value: boolean) => void
  label: string
}) {
  const { isFocused } = useFocus()

  useInput(
    (input, key) => {
      if (input === " " || key.return) onChange(!value)
    },
    { isActive: isFocused },
  )

  const color = isFocused ? "blue" : "white"

  return (
    <Text color={color} bold={isFocused}>
      [<Text color="green">{value ? "✓" : " "}</Text>] {label}
    </Text>
  )
}

export function ButtonInput({
  label,
  onPress,
}: {
  label: string
  onPress: () => void
}) {
  const { isFocused } = useFocus()

  useInput(
    (input, key) => {
      if (input === " " || key.return) onPress()
    },
    { isActive: isFocused },
  )

  const color = isFocused ? "blue" : "white"

  return (
    <Text color={color} bold={isFocused}>
      {label}
    </Text>
  )
}

export function LabeledTextInput({
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

  return (
    <>
      <Text bold={isFocused} color={color}>
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
