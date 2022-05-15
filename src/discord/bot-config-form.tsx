import { useState } from "react"
import { createFetchStore } from "react-suspense-fetch"
import { toError } from "../common/errors"
import { MainSection } from "../ui/main-section"
import { buttonStyle, textInputStyle } from "../ui/styles"

const initialBotConfigStore = createFetchStore((key: void) =>
  typedIpc.invoke("getBotConfig"),
)
initialBotConfigStore.prefetch()

const selectOnFocus = (input: HTMLInputElement | null) => {
  input?.addEventListener("focus", () => input.select())
}

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
      className="flex flex-col gap-3"
    >
      <MainSection title="Discord Bot Token">
        <input
          className={textInputStyle}
          type="password"
          placeholder="••••••••••••"
          value={config.token}
          onChange={(event) => {
            setConfig({ ...config, token: event.target.value })
          }}
          ref={selectOnFocus}
        />
      </MainSection>
      <MainSection title="Discord User ID">
        <input
          className={textInputStyle}
          placeholder="12345678910"
          value={config.userId}
          onChange={(event) => {
            setConfig({ ...config, userId: event.target.value })
          }}
          ref={selectOnFocus}
        />
      </MainSection>
      <button type="submit" className={`${buttonStyle} self-start`}>
        Save
      </button>
    </form>
  )
}
