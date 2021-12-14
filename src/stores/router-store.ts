import { action, makeObservable, observable } from "mobx"
import type { Logger } from "../logger"

type Screen = "main" | "selectSource" | "settings"

export class RouterStore {
  screen: Screen = "selectSource"

  constructor(private logger: Logger) {
    makeObservable(this, {
      screen: observable,
      setScreen: action.bound,
    })
  }

  setScreen(screen: Screen) {
    this.screen = screen
  }
}
