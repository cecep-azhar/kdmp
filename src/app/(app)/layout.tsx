import React from 'react'
import './globals.css'

export const metadata = {
  title: 'Koperasi Merah Putih',
  description: 'Sistem Informasi Digital Koperasi Merah Putih',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
