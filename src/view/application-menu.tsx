import { observer } from "mobx-react-lite"
import React from "react"
import { SelectInput } from "../ink-select-input.js"
import type { Store } from "../store.js"

export const AudioSourceMenu = observer(function AudioSourceMenu({
  store,
}: {
  store: Store
}) {
  return (
    <SelectInput
      items={store.sources.items.map((input) => ({
        key: String(input.sinkInputIndex),
        value: input,
        label: input.name,
      }))}
      initialIndex={store.sources.currentIndex}
      onSelect={(item) => {
        store.sources.setCurrent(item.value)
        store.setScreen("main")
      }}
    />
  )
})
