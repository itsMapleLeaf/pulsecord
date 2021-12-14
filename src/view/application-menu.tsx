import { observer } from "mobx-react-lite"
import React from "react"
import { SelectInput } from "../ink-select-input.js"
import type { PulseStore } from "../stores/pulse-store.js"
import type { RouterStore } from "../stores/router-store.js"

export const AudioSourceMenu = observer(function AudioSourceMenu({
  pulseStore,
  routerStore,
}: {
  pulseStore: PulseStore
  routerStore: RouterStore
}) {
  return (
    <SelectInput
      items={pulseStore.sources.items.map((input) => ({
        key: String(input.sinkInputIndex),
        value: input,
        label: input.name,
      }))}
      initialIndex={pulseStore.sources.currentIndex}
      onSelect={(item) => {
        pulseStore.sources.setCurrent(item.value)
        routerStore.setScreen("main")
      }}
    />
  )
})
