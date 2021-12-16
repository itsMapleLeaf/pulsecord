import * as React from "react"
import { SelectInput } from "../ink-select-input.js"
import { useStores } from "./store-context.jsx"

export function MainMenu({ onQuit }: { onQuit: () => void }) {
  const stores = useStores()
  return (
    <SelectInput
      items={[
        {
          key: "selectApplication",
          label: "Select Audio Source",
          value: () => stores.routerStore.setScreen("selectSource"),
        },
        {
          key: "settings",
          label: "Settings",
          value: () => stores.routerStore.setScreen("settings"),
        },
        {
          key: "quit",
          label: "Quit",
          value: onQuit,
        },
      ]}
      onSelect={(item) => item.value()}
    />
  )
}
