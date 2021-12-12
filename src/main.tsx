import { render } from "ink"
import * as React from "react"
import { Store } from "./store.js"
import { Root } from "./view/root.js"

const store = new Store()
await store.init()

render(<Root store={store} />)
