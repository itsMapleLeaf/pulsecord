import { observer } from "mobx-react-lite"
import React from "react"
import { SelectInput } from "../ink-select-input.js"
import { useStores } from "./store-context.js"

export const AudioSourceMenu = observer(function AudioSourceMenu() {
  const stores = useStores()
  return (
    <SelectInput
      items={stores.pulseStore.selection.sources.map((input) => ({
        key: String(input.sinkInputIndex),
        value: input,
        label: input.name,
      }))}
      initialIndex={stores.pulseStore.selection.currentIndex}
      onSelect={(item) => {
        stores.pulseStore.selection.setCurrentSource(item.value)
        stores.routerStore.setScreen("main")
      }}
    />
  )
})
