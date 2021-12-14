import { raise } from "./helpers/errors.js"

const getEnvironmentValue = (key: string) =>
  process.env[key] ?? raise(`Missing environment variable: ${key}`)

export const discordBotToken = getEnvironmentValue("DISCORD_BOT_TOKEN")
export const discordGuildId = getEnvironmentValue("DISCORD_GUILD_ID")
export const discordUserId = getEnvironmentValue("DISCORD_USER_ID")
