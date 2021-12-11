import type { Deferred } from "./deferred.js"
import { createDeferred } from "./deferred.js"

export function debounce<Args extends unknown[], Result>(
  ms: number,
  fn: (...args: Args) => Result | Promise<Result>,
) {
  let timeout: NodeJS.Timeout | undefined
  let promise: Deferred<Result> | undefined

  return function (...args: Args) {
    promise ??= createDeferred()

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(async () => {
      try {
        promise!.resolve(await fn(...args))
      } catch (error) {
        promise!.reject(error)
      } finally {
        promise = undefined
      }
    }, ms)

    return promise
  }
}
