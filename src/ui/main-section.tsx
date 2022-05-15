import type { ReactNode } from "react"

export function MainSection({
  title,
  children,
}: {
  title: ReactNode
  children: ReactNode
}) {
  return (
    <section>
      <h2 className="font-light text-xl mb-1">{title}</h2>
      {children}
    </section>
  )
}
