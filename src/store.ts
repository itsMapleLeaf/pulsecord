import { action, makeObservable, observable } from "mobx"
import { PulseAudio } from "pulseaudio.js"
import { debounce } from "./helpers/debounce.js"
import { isTruthy } from "./helpers/is-truthy.js"
import type { Logger } from "./logger.js"
import { Selection } from "./selection.js"

type Screen = "main" | "selectSource"

type AudioSource = {
  name: string
  sinkInputIndex: number
  deviceName: string
}

export class Store {
  sources = new Selection<AudioSource>((item) => item.name)
  pulse = new PulseAudio()
  screen: Screen = "selectSource"

  constructor(private logger: Logger) {
    makeObservable(this, {
      screen: observable,
      setScreen: action.bound,
    })
  }

  setScreen(screen: Screen) {
    this.screen = screen
  }

  async disconnect() {
    await this.pulse.disconnect()
  }

  async init() {
    await this.pulse.connect()
    this.fetchApplications()

    this.pulse.on("event.sink_input.new", this.fetchApplications)
    this.pulse.on("event.sink_input.changed", this.fetchApplications)
    this.pulse.on("event.sink_input.remove", this.fetchApplications)
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

      this.sources.setItems(sources.filter(isTruthy))
    } catch (error) {
      this.logger.errorStack("Failed to fetch audio sources", error)
    }
  })
}
