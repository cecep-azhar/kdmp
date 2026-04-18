import React from 'react'
import '@payloadcms/next/css'
import './admin/custom.scss'

/* 
  Root Layout for Payload Route Group 
  Mencegah auto-generated layout Next.js yang nge-bug (menghilangkan CSS dari child layouts)
*/
export default function PayloadRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
