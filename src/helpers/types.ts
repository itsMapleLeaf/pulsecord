export type Falsy = false | 0 | "" | null | undefined
export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json }
