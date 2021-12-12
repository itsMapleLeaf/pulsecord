import { action, makeObservable, observable } from "mobx"
import { PulseAudio } from "pulseaudio.js"
import { debounce } from "./helpers/debounce.js"
import { isTruthy } from "./helpers/is-truthy.js"
import { IndexSelection } from "./index-selection.js"

type Screen = "main" | "selectSource"

type AudioSource = {
  name: string
  sinkInputIndex: number
  deviceName: string
}

export class Store {
  sources = new IndexSelection<AudioSource>()
  pulse = new PulseAudio()
  screen: Screen = "main"

  constructor() {
    makeObservable(this, {
      screen: observable,
      setScreen: action.bound,
    })
  }

  setScreen(screen: Screen) {
    this.screen = screen
  }

  async quit() {
    await this.pulse.disconnect()
    process.exit(0)
  }

  async init() {
    await this.pulse.connect()
    await Promise.all([this.fetchApplications()])

    this.pulse.on("event.sink_input.new", this.fetchApplications)
    this.pulse.on("event.sink_input.changed", this.fetchApplications)
    this.pulse.on("event.sink_input.remove", this.fetchApplications)
  }

  fetchApplications = debounce(500, async () => {
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
        } catch (error: any) {
          console.error(
            `Failed to get device for ${name}:`,
            error.message || error,
          )
          return undefined
        }
      }),
    )

    this.sources.setItems(sources.filter(isTruthy))
  })
}
