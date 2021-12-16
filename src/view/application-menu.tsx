import { observer } from "mobx-react-lite"
import React from "react"
import { SelectInput } from "../ink-select-input.js"
import { useStores } from "./store-context.js"

export const AudioSourceMenu = observer(function AudioSourceMenu() {
  const stores = useStores()
  return (
    <SelectInput
      items={stores.pulseStore.sources.items.map((input) => ({
        key: String(input.sinkInputIndex),
        value: input,
        label: input.name,
      }))}
      initialIndex={stores.pulseStore.sources.currentIndex}
      onSelect={(item) => {
        stores.pulseStore.sources.setCurrent(item.value)
        stores.routerStore.setScreen("main")
      }}
    />
  )
})
