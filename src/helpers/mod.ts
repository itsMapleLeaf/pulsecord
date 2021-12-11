// modulo, but wraps with negative numbers
export function mod(value: number, radix: number) {
  return ((value % radix) + radix) % radix
}
