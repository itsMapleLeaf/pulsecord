import { render } from "ink"
import * as React from "react"
import { Bot } from "./bot.js"
import { Store } from "./store.js"
import { Root } from "./view/root.js"

const store = new Store()
await store.init()

const bot = new Bot(store)
await bot.run()

render(<Root store={store} />)
