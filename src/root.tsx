import { XIcon } from "@heroicons/react/solid"
import { BotConfigForm } from "./discord/bot-config-form"
import { AudioSourceSelection } from "./pulseaudio/audio-source-selection"
import { MainSection } from "./ui/main-section"

export function Root() {
  return (
    <>
      <header className="p-4">
        <h1 className="text-2xl font-light opacity-50 text-center">
          PulseCord
        </h1>
      </header>
      <nav className="absolute top-0 right-0 no-drag">
        <button
          className="p-2 leading-none opacity-50 hover:opacity-100 transition active:translate-y-0.5 active:duration-0"
          title="Close"
          onClick={() => window.close()}
        >
          <XIcon className="h-6" />
        </button>
      </nav>
      <section className="bg-slate-800 rounded-md p-4 mx-3 flex flex-col gap-3 shadow-lg no-drag">
        <BotConfigForm />
      </section>
      <section className="bg-slate-800 rounded-md p-4 mx-3 flex flex-col gap-3 shadow-lg no-drag">
        <MainSection title="Audio Sources">
          <AudioSourceSelection />
        </MainSection>
      </section>
    </>
  )
}
