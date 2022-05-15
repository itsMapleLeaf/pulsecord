import { useState } from "react"
import type { AudioSource } from "./pulseaudio"

export function Root() {
  const [audioSources, setAudioSources] = useState<AudioSource[]>([])
  return (
    <main>
      <label>
        <div>Select audio source ({audioSources.length})</div>
        <select value={[]}>
          <option>Choose one...</option>
          {audioSources.map((source) => (
            <option key={source.sinkInputIndex}>{source.name}</option>
          ))}
        </select>
      </label>
    </main>
  )
}
