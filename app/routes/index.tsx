import type { LiveDataFunction } from "@remix-electron/renderer"
import { useLiveData } from "@remix-electron/renderer"
import { useState } from "react"
import type { AudioSource } from "../pulse.server"
import { createAudioDeviceSubscriber } from "../pulse.server"

type PublishData = {
  audioSources: AudioSource[]
}

export const liveData: LiveDataFunction<PublishData> = ({ publish }) => {
  return createAudioDeviceSubscriber((audioSources) => {
    publish({ audioSources })
  })
}

export default function Index() {
  const { audioSources } = useLiveData<PublishData>() ?? { audioSources: [] }

  const [selected, setSelected] = useState<{
    name: string
    sinkInputIndex: number
  }>()

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
