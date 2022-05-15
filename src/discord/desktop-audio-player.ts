import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  StreamType,
} from "@discordjs/voice"
import type { ChildProcess } from "node:child_process"
import { spawn } from "node:child_process"
import { createInterface } from "node:readline"
import type { AudioSource } from "../pulseaudio/audio-source"

export class DesktopAudioPlayer {
  source?: AudioSource
  private recordingProcess?: ChildProcess
  readonly player = this.createPlayer()

  private createPlayer() {
    const player = createAudioPlayer()

    // @ts-expect-error
    player.on("stateChange", (_, state) => {
      console.info(`player state: ${state.status}`)

      // sometimes the player goes idle because parec decides to stop sending data,
      // so we need to restart the process whenever that happens
      setTimeout(() => {
        if (state.status === AudioPlayerStatus.Idle && this.source) {
          this.createAudioRecordingProcess(this.source)
        }
      }, 1000)
    })

    player.on("error", (error) => {
      console.error("Player error", error)
    })

    return player
  }

  setAudioSource(source: AudioSource) {
    this.source = source
    this.createAudioRecordingProcess(source)
  }

  createAudioRecordingProcess(source: AudioSource) {
    this.recordingProcess?.kill()

    // const command = [
    //   `--device=${source.deviceName}`,
    //   `--monitor-stream=${source.sinkInputIndex}`,
    //   "--format=s16le",
    //   "--rate=44100",
    //   "--channels=1",
    //   "--verbose",
    // ]

    this.recordingProcess = spawn("parec", [
      `--device=${source.deviceName}`,
      `--monitor-stream=${source.sinkInputIndex}`,
      "--format=s16le",
      "--fix-rate",
      "--verbose",
    ])

    this.recordingProcess.on("error", (error) =>
      console.error("parec error", error),
    )

    const lineReader = createInterface(this.recordingProcess.stderr!)
    lineReader.on("line", (line) => console.info("[parec]", line))

    this.player.play(
      createAudioResource(this.recordingProcess.stdout!, {
        inputType: StreamType.Raw,
      }),
    )
  }
}
