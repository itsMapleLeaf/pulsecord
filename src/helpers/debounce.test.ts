import test from "ava"
import { debounce } from "./debounce.js"

test("debounce", async (t) => {
  let count = 0

  const debounced = debounce(100, () => {
    count += 1
    return count
  })

  void debounced()
  void debounced()
  void debounced()
  t.is(await debounced(), 1)

  void debounced()
  void debounced()
  void debounced()
  t.is(await debounced(), 2)
})
