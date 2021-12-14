// modulo, but wraps with negative numbers
export function modulo(value: number, radix: number) {
  return ((value % radix) + radix) % radix
}
