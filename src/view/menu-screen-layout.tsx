import { Box, Text } from "ink"
import type { ReactNode } from "react"
import React from "react"

export function MenuScreenLayout({ children }: { children: React.ReactNode }) {
  return <Box flexDirection="column">{children}</Box>
}

MenuScreenLayout.Title = function Title({ children }: { children: ReactNode }) {
  return (
    <Box marginLeft={2} marginBottom={1}>
      <Text bold>{children}</Text>
    </Box>
  )
}

MenuScreenLayout.Section = function Section({
  children,
}: {
  children: ReactNode
}) {
  return (
    <Box flexDirection="column" marginLeft={2}>
      {children}
    </Box>
  )
}

MenuScreenLayout.ListSection = function ListSection({
  children,
}: {
  children: ReactNode
}) {
  return <Box>{children}</Box>
}
