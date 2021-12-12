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
import { discordBotToken, discordGuildId, discordUserId } from "./env.js"
import { raise } from "./helpers/errors.js"
import type { Store } from "./store.js"

export class Bot {
  client = this.createClient()
  player = Bot.createPlayer()
  recorder?: ExecaChildProcess

  constructor(private readonly store: Store) {}

  async run() {
    // these computed values makes it so that the autorun only runs
    // when these specific values change,
    // and not when the whole list of sources or source object changes
    const deviceName = computed(() => {
      return this.store.sources.currentItem?.deviceName
    })

    const sinkInputIndex = computed(() => {
      return this.store.sources.currentItem?.sinkInputIndex
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
        ],
        { stderr: "inherit", reject: false },
      )

      this.player.play(
        createAudioResource(this.recorder.stdout!, {
          inputType: StreamType.Raw,
        }),
      )
    })

    await this.client.login(discordBotToken)
  }

  private static createPlayer() {
    const player = createAudioPlayer()
    player.on("stateChange", (_, newState) => {
      console.info(`player state: ${newState.status}`)
    })
    return player
  }

  private createClient() {
    const client = new Client({
      intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_VOICE_STATES"],
    })

    client.on("ready", () => {
      this.joinVoiceChannel()
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
      .on("stateChange", (_, newState) => {
        console.info(`voice state: ${newState.status}`)
      })
      .subscribe(this.player)
  }
}
