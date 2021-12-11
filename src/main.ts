import {
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
  StreamType,
} from "@discordjs/voice"
import { Client } from "discord.js"
import "dotenv/config"
import { execa } from "execa"
import { discordBotToken, discordGuildId, discordUserId } from "./env.js"
import { raise } from "./errors.js"

// import { PA_SAMPLE_FORMAT, PulseAudio } from "pulseaudio.js"
// const pulseAudio = new PulseAudio()
// const sinkInputs = await pulseAudio.getSinkInputList()

// const pulseAudioStream = await pulseAudio.createRecordStream({
//   // index: sinkInputs[0]?.index,
//   index: 47,
//   sampleSpec: { rate: 44100, format: PA_SAMPLE_FORMAT.S16LE, channels: 2 },
// })

// const opusEncoder = new OpusEncoder(
//   48000,
//   2,
//   2049 /* OpusApplication.OPUS_APPLICATION_AUDIO */,
// )

const recorder = execa("parec", [
  "--device=alsa_output.usb-Generic_TX-Hifi_Type_C_Audio-00.analog-stereo.monitor",
  "--monitor-stream=181",
  "--file-format=flac",
])

const player = createAudioPlayer()
player.play(
  createAudioResource(recorder.stdout!, { inputType: StreamType.Arbitrary }),
)

player.on("stateChange", (_, newState) => {
  console.info(`player state: ${newState.status}`)
})

const client = new Client({
  intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_VOICE_STATES"],
})

client.on("ready", () => {
  const guild =
    client.guilds.cache.get(discordGuildId) ??
    raise(`Couldn't find guild with id ${discordGuildId}`)

  const user =
    guild.members.cache.get(discordUserId) ??
    raise(`Couldn't find user with id ${discordUserId}`)

  const connection = getVoiceConnection(guild.id)
  if (
    connection?.joinConfig.channelId !== user.voice.channelId &&
    user.voice.channelId
  ) {
    joinVoiceChannel({
      guildId: guild.id,
      channelId: user.voice.channelId,
      adapterCreator: guild.voiceAdapterCreator,
    })
      .on("stateChange", (_, newState) => {
        console.info(`voice state: ${newState.status}`)
      })
      .subscribe(player)
  }
})

await client.login(discordBotToken)
