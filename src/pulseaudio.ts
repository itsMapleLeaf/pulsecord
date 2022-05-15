import { PulseAudio } from "pulseaudio.js"

export type AudioSource = {
  name: string
  deviceName: string
  sinkInputIndex: number
}

export async function getAudioSources(
  pulse: PulseAudio,
): Promise<AudioSource[]> {
  const inputs: Array<Record<string, any>> = await pulse.getSinkInputList()

  return await Promise.all(
    inputs.map(async (input): Promise<AudioSource> => {
      const name =
        input.properties.application?.name ??
        input.properties.media?.name ??
        input.name

      const info = await pulse.getSinkInfo(input.sink)

      return {
        name,
        deviceName: info.monitor?.name ?? info.name,
        sinkInputIndex: input.index,
      }
    }),
  )
}

export function createAudioDeviceSubscriber(
  onSourcesChange: (sources: AudioSource[]) => void,
): () => void {
  const pulse = new PulseAudio()

  const publishSources = async () => {
    onSourcesChange(await getAudioSources(pulse))
  }

  void (async () => {
    await pulse.connect()
    await publishSources()
    pulse.on("event.sink_input.new", publishSources)
    pulse.on("event.sink_input.changed", publishSources)
    pulse.on("event.sink_input.remove", publishSources)
  })()

  return () => {
    void pulse.disconnect()
  }
}
