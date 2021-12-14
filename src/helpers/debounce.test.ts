import test from "ava"
import { setTimeout } from "node:timers/promises"
import { debounce } from "./debounce.js"

test("debounce", async (t) => {
  let count = 0

  const debounced = debounce(100, () => {
    count += 1
  })

  void debounced()
  void debounced()
  void debounced()
  await setTimeout(150)
  t.is(count, 1)

  void debounced()
  await setTimeout(50)
  void debounced()
  void debounced()
  await setTimeout(150)
  t.is(count, 2)
})
