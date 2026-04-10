import type { Metadata } from "next"
import { BRANDING } from "@/lib/branding"

export const metadata: Metadata = {
  title: BRANDING.platformName,
  description: BRANDING.tagline,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
