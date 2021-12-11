import { Box, render, Text } from "ink"
import * as React from "react"
import { Select } from "./select.js"

function App() {
  const options = ["a", "b", "c"]
  const [value, setValue] = React.useState<string>()

  return (
    <Box flexDirection="column">
      <Select
        options={options.map((value) => ({ value }))}
        value={value}
        onChange={setValue}
      />
      <Text>{value}</Text>
    </Box>
  )
}

render(<App />)
