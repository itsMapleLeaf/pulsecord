import { useEffect, useState } from "react"
import type { AudioSource } from "./pulseaudio"

export function Root() {
  const [audioSources, setAudioSources] = useState<AudioSource[]>([])
  const [selection, setSelection] = useState<AudioSource>()

  // the sink input index of the same source can change over time,
  // so we'll get a current source where any of the identifying properties match
  // we do _not_ check the device name,
  // because multiple sources can come from the same device
  const currentAudioSource =
    audioSources.find(
      (source) => source.sinkInputIndex === selection?.sinkInputIndex,
    ) ?? audioSources.find((source) => source.name === selection?.name)

  useEffect(() => desktopApi.subscribeToAudioSources(setAudioSources), [])

  return (
    <main>
      {audioSources.length > 0 ? (
        <section>
          <h2>Audio source</h2>
          {audioSources.map((source) => (
            <label key={source.sinkInputIndex} className="block">
              <input
                type="radio"
                checked={source === currentAudioSource}
                onChange={() => setSelection(source)}
              />{" "}
              {source.name}
            </label>
          ))}
        </section>
      ) : (
        <p>No audio sources found. Start playing something!</p>
      )}
    </main>
  )
}
