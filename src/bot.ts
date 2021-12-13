import {
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
import { autorun, computed } from "mobx"
import { createInterface } from "readline"
import { discordBotToken, discordGuildId, discordUserId } from "./env.js"
import { raise } from "./helpers/errors.js"
import type { Logger } from "./logger.js"
import type { Store } from "./store.js"

export class Bot {
  client = this.createClient()
  player = this.createPlayer()
  recorder?: ExecaChildProcess

  constructor(private readonly logger: Logger, private readonly store: Store) {}

  async run() {
    // these computed values makes it so that the autorun only runs
    // when these specific values change,
    // and not when the whole list of sources or source object changes
    const deviceName = computed(() => {
      return this.store.sources.current?.deviceName
    })

    const sinkInputIndex = computed(() => {
      return this.store.sources.current?.sinkInputIndex
    })

    autorun(() => {
      this.recorder?.kill()

      if (!deviceName.get()) return
      if (!sinkInputIndex.get()) return

      this.recorder = execa(
        "parec",
        [
          `--device=${deviceName.get()}`,
          `--monitor-stream=${sinkInputIndex.get()}`,
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
    })

    await this.client.login(discordBotToken)
  }

  private createPlayer() {
    const player = createAudioPlayer()

    player.on("stateChange", (_, state) => {
      this.logger.info(`player state: ${state.status}`)
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
      this.client.guilds.cache.get(discordGuildId) ??
      raise(`Couldn't find guild with id ${discordGuildId}`)

    const user =
      guild.members.cache.get(discordUserId) ??
      raise(`Couldn't find user with id ${discordUserId}`)

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
    getVoiceConnection(discordGuildId)?.disconnect()
  }
}
