import { makeAutoObservable } from "mobx"
import { PulseAudio } from "pulseaudio.js"
import { debounce } from "./helpers/debounce.js"

type SinkInput = {
  index: number
  name: string
}

type PulseaudioSinkInput = {
  index: number
  properties: {
    application: {
      name: string
    }
  }
}

export class Store {
  sinkInputs: SinkInput[] = []
  selectedSinkInputIndex?: number = undefined
  pulse = new PulseAudio()

  constructor() {
    makeAutoObservable(this, { pulse: false }, { autoBind: true })
  }

  setSinkInputs(inputs: SinkInput[]) {
    this.sinkInputs = inputs
  }

  setSelectedSinkInputIndex(index: number) {
    this.selectedSinkInputIndex = index
  }

  get selectedSinkInput() {
    return this.sinkInputs.find(
      (input) => input.index === this.selectedSinkInputIndex,
    )
  }

  async init() {
    await this.pulse.connect()
    await this.fetchSinkInputs()

    const firstIndex = this.sinkInputs[0]?.index
    if (firstIndex != null) {
      this.setSelectedSinkInputIndex(firstIndex)
    }

    this.pulse.on("event.sink_input.new", this.fetchSinkInputs)
    this.pulse.on("event.sink_input.changed", this.fetchSinkInputs)
    this.pulse.on("event.sink_input.remove", this.fetchSinkInputs)
  }

  fetchSinkInputs = debounce(500, async () => {
    const inputs =
      (await this.pulse.getSinkInputList()) as PulseaudioSinkInput[]

    this.setSinkInputs(
      inputs.map((input) => ({
        index: input.index,
        name: input.properties.application.name,
      })),
    )
  })
}
