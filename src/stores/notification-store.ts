import { Setting } from "../setting.js"

export class NotificationStore {
  enabled = new Setting<boolean>("enabled", false)
}
