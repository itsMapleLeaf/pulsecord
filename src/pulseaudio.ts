import type { PulseAudio } from "pulseaudio.js"

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
