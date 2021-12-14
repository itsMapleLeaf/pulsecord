export function debounce<Args extends unknown[], Result>(
  ms: number,
  callback: (...args: Args) => Result,
) {
  let timeout: NodeJS.Timeout | undefined

  return function (...args: Args) {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      callback(...args)
    }, ms)
  }
}
