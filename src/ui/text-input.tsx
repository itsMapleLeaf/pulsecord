import type { ComponentPropsWithoutRef } from "react"

export function TextInput({
  className,
  ...props
}: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      {...props}
      className="bg-slate-900 rounded p-2 leading-none w-full"
    />
  )
}
