import { render } from "ink"
import * as React from "react"
import { Store } from "./store.js"
import { SinkInputSelect } from "./view/sink-input-select.js"

const store = new Store()
await store.init()

render(<SinkInputSelect store={store} />)
