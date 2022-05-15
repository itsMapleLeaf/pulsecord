import type { ComponentPropsWithoutRef } from "react"

export function TextInput({
  className,
  ...props
}: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      {...props}
      className="bg-slate-900 rounded p-3 leading-none w-full focus:outline-none focus-visible:ring-2 shadow-inner"
    />
  )
}
