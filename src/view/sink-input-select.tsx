import { Box } from "ink"
import { observer } from "mobx-react-lite"
import React from "react"
import type { Store } from "../store.js"
import { Select } from "./select.js"

export const SinkInputSelect = observer(function SinkInputSelect({
  store,
}: {
  store: Store
}) {
  return (
    <Box flexDirection="column">
      <Select
        options={store.sinkInputs.map((input) => ({
          value: input.index,
          label: input.name,
        }))}
        value={store.selectedSinkInputIndex}
        onChange={store.setSelectedSinkInputIndex}
      />
    </Box>
  )
})
