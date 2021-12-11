import { Box, Text, useInput } from "ink"
import React from "react"
import { mod } from "./mod.js"

type SelectOption = {
  value: string
  name?: string
}

export function Select({
  options,
  value,
  onChange,
}: {
  options: SelectOption[]
  value?: string
  onChange: (value: string) => void
}) {
  useInput((_, key) => {
    if (!value && options[0]) {
      onChange(options[0].value)
      return
    }

    let index = options.findIndex((option) => option.value === value) ?? 0
    if (key.upArrow) {
      index -= 1
    } else if (key.downArrow) {
      index += 1
    } else {
      return
    }

    const newOption = options[mod(index, options.length)]
    if (newOption) onChange(newOption.value)
  })

  return (
    <Box flexDirection="column">
      {options.map((option) => (
        <Text
          key={option.value}
          color={option.value === value ? "green" : "gray"}
        >
          {option.value === value ? "> " : "  "}
          {option.name || option.value}
        </Text>
      ))}
    </Box>
  )
}
