import { makeAutoObservable, toJS } from "mobx"
import { PulseAudio } from "pulseaudio.js"
import { debounce } from "../helpers/debounce.js"
import { isTruthy } from "../helpers/is-truthy.js"
import type { Logger } from "../logger.js"

type AudioSource = {
  name: string
  sinkInputIndex: number
  deviceName: string
}

class AudioSourceSelection {
  sourceMap = new Map<number, AudioSource>()
  currentSinkInputIndex?: number = undefined
  currentName?: string = undefined

  constructor(readonly logger: Logger) {
    makeAutoObservable(this, { logger: false })
  }

  get sources() {
    return [...this.sourceMap.values()]
  }

  setSources(sources: AudioSource[]) {
    const newSourceMap = new Map<number, AudioSource>()
    for (const source of sources) {
      newSourceMap.set(
        source.sinkInputIndex,
        this.sourceMap.get(source.sinkInputIndex) ?? source,
      )
    }
    this.sourceMap = newSourceMap
  }

  setCurrentSource(source: AudioSource) {
    this.currentName = source.name
    this.currentSinkInputIndex = source.sinkInputIndex
  }

  get currentSource() {
    const source =
      this.sources.find(
        (source) => source.sinkInputIndex === this.currentSinkInputIndex,
      ) ?? this.sources.find((source) => source.name === this.currentName)

    this.logger.info("current source:", toJS(source))

    return source
  }

  get currentIndex() {
    return this.currentSource
      ? Math.max(this.sources.indexOf(this.currentSource), 0)
      : undefined
  }
}

export class PulseStore {
  pulse = new PulseAudio()
  selection = new AudioSourceSelection(this.logger)

  constructor(readonly logger: Logger) {}

  async init() {
    await this.pulse.connect()
    this.fetchApplications()

    this.pulse.on("event.sink_input.new", this.fetchApplications)
    this.pulse.on("event.sink_input.changed", this.fetchApplications)
    this.pulse.on("event.sink_input.remove", this.fetchApplications)
  }

  async disconnect() {
    await this.pulse.disconnect()
  }

  get currentAudioSource() {
    return this.selection.currentSource
  }

  // eslint-disable-next-line unicorn/consistent-function-scoping
  fetchApplications = debounce(500, async () => {
    try {
      const inputs: Array<Record<string, any>> =
        await this.pulse.getSinkInputList()

      const sources = await Promise.all(
        inputs.map(async (input) => {
          const name =
            input.properties.application?.name ??
            input.properties.media?.name ??
            input.name

          try {
            const source = await this.pulse.getSinkInfo(input.sink)

            return {
              name,
              sinkInputIndex: input.index,
              deviceName: source.monitor?.name ?? source.name,
            }
          } catch (error) {
            this.logger.errorStack(`Failed to get device for ${name}:`, error)
          }
        }),
      )

      this.selection.setSources(sources.filter(isTruthy))
    } catch (error) {
      this.logger.errorStack("Failed to fetch audio sources", error)
    }
  })
}
