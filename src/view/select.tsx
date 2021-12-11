import { Box, Text, useInput } from "ink"
import React from "react"
import { mod } from "../helpers/mod.js"

type SelectOption<Value extends string | number> = {
  value: Value
  label?: string
}

export function Select<Value extends string | number>({
  options,
  value,
  onChange,
}: {
  options: Array<SelectOption<Value>>
  value?: Value
  onChange: (value: Value) => void
}) {
  useInput((_, key) => {
    if (value == null && options[0] != null) {
      onChange(options[0].value)
      return
    }

    let index = Math.max(
      options.findIndex((option) => option.value === value),
      0,
    )

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
          {option.label || option.value}
        </Text>
      ))}
    </Box>
  )
}
