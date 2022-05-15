import { AudioSourceSelection } from "./pulseaudio/audio-source-selection"
import { MainSection } from "./ui/main-section"

export function Root() {
  return (
    <main>
      <MainSection title="Audio Sources">
        <AudioSourceSelection />
      </MainSection>
    </main>
  )
}
