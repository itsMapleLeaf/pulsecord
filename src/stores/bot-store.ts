import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
  StreamType,
} from "@discordjs/voice"
import { Client } from "discord.js"
import "dotenv/config"
import type { ExecaChildProcess } from "execa"
import { execa } from "execa"
import { autorun, computed, makeObservable } from "mobx"
import { createInterface } from "node:readline"
import { raise } from "../helpers/errors.js"
import type { Logger } from "../logger.js"
import { Setting } from "../setting.js"
import type { PulseStore } from "../stores/pulse-store.js"

export class BotStore {
  client = this.createClient()
  player = this.createPlayer()
  recorder?: ExecaChildProcess

  constructor(
    private readonly logger: Logger,
    private readonly pulseStore: PulseStore,
  ) {
    makeObservable(this, {
      deviceName: computed,
      sinkInputIndex: computed,
    })

    autorun(() => {
      const { deviceName, sinkInputIndex } = this
      if (deviceName && sinkInputIndex !== undefined) {
        this.play(deviceName, sinkInputIndex)
      }
    })

    autorun(() => {
      const token = this.botToken.value
      if (token) {
        this.client
          .login(token)
          .catch((error) => this.logger.errorStack("login error", error))
      }
    })
  }

  botToken = new Setting<string>("botToken", "")
  userId = new Setting<string>("userId", "not set")
  guildId = new Setting<string>("guildId", "not set")

  // these computed values makes it so that the autorun only runs
  // when these specific values change,
  // and not when the whole list of sources or source object changes
  get deviceName() {
    return this.pulseStore.sources.current?.deviceName
  }

  get sinkInputIndex() {
    return this.pulseStore.sources.current?.sinkInputIndex
  }

  private play(deviceName: string, sinkInputIndex: number) {
    this.recorder?.kill()

    this.recorder = execa(
      "parec",
      [
        `--device=${deviceName}`,
        `--monitor-stream=${sinkInputIndex}`,
        "--format=s16le",
        "--rate=48000",
        "--verbose",
      ],
      { reject: false },
    ).on("error", (error) => this.logger.errorStack("parec error", error))

    const lineReader = createInterface(this.recorder.stderr!)
    lineReader.on("line", (line) => this.logger.info("[parec]", line))

    this.player.play(
      createAudioResource(this.recorder.stdout!, {
        inputType: StreamType.Raw,
      }),
    )
  }

  private createPlayer() {
    const player = createAudioPlayer()

    player.on("stateChange", (_, state) => {
      this.logger.info(`player state: ${state.status}`)

      setTimeout(() => {
        if (
          state.status === AudioPlayerStatus.Idle &&
          this.deviceName &&
          this.sinkInputIndex !== undefined
        ) {
          this.play(this.deviceName, this.sinkInputIndex)
        }
      }, 2000)
    })

    player.on("error", (error) => {
      this.logger.errorStack("Player error", error)
    })

    return player
  }

  private createClient() {
    const client = new Client({
      intents: ["GUILDS", "GUILD_VOICE_STATES"],
    })

    client.on("ready", () => {
      this.joinVoiceChannel()
    })

    client.on("error", (error) => {
      this.logger.errorStack("Discord client error", error)
    })

    return client
  }

  private joinVoiceChannel() {
    const guild =
      this.client.guilds.cache.get(this.guildId.value) ??
      raise(`Couldn't find guild with id ${this.guildId.value}`)

    const user =
      guild.members.cache.get(this.userId.value) ??
      raise(`Couldn't find user with id ${this.userId.value}`)

    if (!user.voice.channelId) return

    const connection = getVoiceConnection(guild.id)
    if (connection?.joinConfig.channelId === user.voice.channelId) return

    joinVoiceChannel({
      guildId: guild.id,
      channelId: user.voice.channelId,
      adapterCreator: guild.voiceAdapterCreator,
    })
      .on("stateChange", (_, state) => {
        this.logger.info(`voice state: ${state.status}`)
      })
      .on("error", (error) => {
        this.logger.errorStack("Voice connection error", error)
      })
      .subscribe(this.player)
  }

  // eslint-disable-next-line class-methods-use-this
  leave() {
    getVoiceConnection(this.guildId.value)?.disconnect()
    this.client.destroy()
  }
}