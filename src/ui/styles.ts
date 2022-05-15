import clsx from "clsx"

const inputBase = clsx`
  rounded p-3 leading-none
  transition
  bg-black/50 hover:bg-black/75 focus:bg-black/75
  focus:outline-none focus-visible:ring-2
`

export const textInputStyle = `${inputBase} w-full`

export const buttonStyle = inputBase
