import type {
  DiscordGatewayAdapterCreator,
  VoiceConnection,
} from "@discordjs/voice"
import { joinVoiceChannel } from "@discordjs/voice"
import type { GuildMember } from "discord.js"
import { Client } from "discord.js"
import ElectronStore from "electron-store"
import type { PulseAudio } from "pulseaudio.js"
import { z } from "zod"
import type { AudioSource } from "../pulseaudio/audio-source"

const botConfigSchema = z.object({
  token: z.string().nonempty(),
  userId: z.string().nonempty(),
})
export type BotConfig = z.infer<typeof botConfigSchema>

const store = new ElectronStore<{
  discordBotConfig?: unknown
}>()

export class Bot {
  config?: BotConfig
  client?: Client
  audioSource?: AudioSource
  voiceConnection?: VoiceConnection

  constructor(private readonly pulse: PulseAudio) {}

  async init() {
    const config = botConfigSchema.safeParse(store.get("discordBotConfig"))
    if (config.success) await this.setConfig(config.data)
  }

  async setConfig(config: BotConfig) {
    this.config = config
    store.set("discordBotConfig", config)
    await this.createClient(config)
  }

  async createClient(config: BotConfig) {
    this.client?.destroy()

    const client = (this.client = new Client({
      intents: ["GUILDS", "GUILD_VOICE_STATES"],
    }))

    client.on("error", (error) => {
      console.error(error)
    })

    client.on("ready", async () => {
      console.info("Client ready")

      const memberResults = await Promise.allSettled(
        [...client.guilds.cache.values()].map((guild) =>
          guild.members.fetch(config.userId),
        ),
      )

      const member = memberResults.find(
        (result): result is PromiseFulfilledResult<GuildMember> =>
          result.status === "fulfilled" &&
          result.value.voice.channelId != undefined,
      )?.value

      if (member?.voice.channelId) {
        this.joinVoiceChannel(
          member.guild.id,
          member.voice.channelId,
          // @ts-expect-error
          member.guild.voiceAdapterCreator,
        )
      }
    })

    client.on("voiceStateUpdate", (oldState, newState) => {
      if (
        oldState.channelId !== newState.channelId &&
        newState.member?.user.id === config.userId
      ) {
        if (newState.channelId) {
          this.joinVoiceChannel(
            newState.guild.id,
            newState.channelId,
            // @ts-expect-error
            newState.guild.voiceAdapterCreator,
          )
        } else {
          this.voiceConnection?.disconnect()
        }
      }
    })

    await client.login(config.token)
  }

  joinVoiceChannel(
    guildId: string,
    channelId: string,
    adapterCreator: DiscordGatewayAdapterCreator,
  ) {
    this.voiceConnection = joinVoiceChannel({
      guildId,
      channelId,
      adapterCreator,
    })
      // @ts-expect-error
      .on("stateChange", (_, state) => {
        console.info(`voice state: ${state.status}`)
      })
      .on("error", (error) => {
        console.error("Voice connection error", error)
      })
  }

  destroyClient() {
    this.client?.destroy()
  }
}

const maybeString = (value: unknown) =>
  typeof value === "string" ? value : undefined
