import { useState } from "react"
import { createFetchStore } from "react-suspense-fetch"
import { toError } from "../common/errors"
import { MainSection } from "../ui/main-section"
import { TextInput } from "../ui/text-input"

const initialBotConfigStore = createFetchStore((key: void) =>
  typedIpc.invoke("getBotConfig"),
)
initialBotConfigStore.prefetch()

export function BotConfigForm() {
  const [config, setConfig] = useState(
    initialBotConfigStore.get() ?? { token: "", userId: "" },
  )

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        typedIpc
          .invoke("setBotConfig", config)
          .catch((error) => alert(toError(error).message))
      }}
    >
      <MainSection title="Discord Bot Token">
        <TextInput
          type="password"
          placeholder="••••••••••••"
          value={config.token}
          onChange={(event) => {
            setConfig({ ...config, token: event.target.value })
          }}
        />
      </MainSection>
      <MainSection title="Discord User ID">
        <TextInput
          placeholder="12345678910"
          value={config.userId}
          onChange={(event) => {
            setConfig({ ...config, userId: event.target.value })
          }}
        />
      </MainSection>
      <button type="submit">Save</button>
    </form>
  )
}
