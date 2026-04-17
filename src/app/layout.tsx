// Root layout — required by Next.js App Router for nested route resolution.
// NOTE: Payload admin will render its own html/body via RootLayout from @payloadcms/next/layouts.
// This causes double html/body but is suppressed via suppressHydrationWarning.
// This is the required pattern when integrating Payload CMS v3 into an existing Next.js app.
import React from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

