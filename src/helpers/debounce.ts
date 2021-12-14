import type { Deferred } from "./deferred.js"
import { createDeferred } from "./deferred.js"

export function debounce<Args extends unknown[], Result>(
  ms: number,
  callback: (...args: Args) => Result | Promise<Result>,
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
        promise!.resolve(await callback(...args))
      } catch (error) {
        promise!.reject(error)
      }
      promise = undefined
    }, ms)

    return promise
  }
}
