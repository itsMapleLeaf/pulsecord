import { raise } from "./helpers/errors.js"

const getEnv = (key: string) =>
  process.env[key] ?? raise(`Missing environment variable: ${key}`)

export const discordBotToken = getEnv("DISCORD_BOT_TOKEN")
export const discordGuildId = getEnv("DISCORD_GUILD_ID")
export const discordUserId = getEnv("DISCORD_USER_ID")
