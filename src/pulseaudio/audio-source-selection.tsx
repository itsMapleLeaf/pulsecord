import { useEffect, useState } from "react"
import type { AudioSource } from "./audio-source"

export function AudioSourceSelection() {
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

  useEffect(
    () =>
      typedIpc.subscribe("audioSources", (_, sources) =>
        setAudioSources(sources),
      ),
    [],
  )

  return (
    <>
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
      {audioSources.length === 0 && (
        <p>No audio sources found. Start playing something!</p>
      )}
    </>
  )
}
