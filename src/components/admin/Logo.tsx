import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

const Logo = async () => {
  const payload = await getPayload({ config: configPromise })
  const settings = await payload.findGlobal({ slug: 'settings' })
  const appName = settings?.appName || 'Koperasi Desa Merah Putih'
  const nameParts = appName.split(' ')
  const mainPart = nameParts[0] || 'Koperasi'
  const subPart = nameParts.slice(1).join(' ') || 'Desa Merah Putih'
  const primaryColor = settings?.primaryColor || '#DC2626'

  // If Logo exists, you could potentially fetch its URL. For simplicity in default UI, we use text.
  // Assuming no appLogo logic here yet, but we will adapt colors and text.

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '0',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: `linear-gradient(135deg, ${primaryColor}, #FFFFFF)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: 'bold',
        color: primaryColor,
        border: `2px solid ${primaryColor}`,
      }}>
        {mainPart.charAt(0).toUpperCase()}
      </div>
      <div>
        <div style={{
          fontSize: '16px',
          fontWeight: '700',
          lineHeight: '1.2',
          color: 'var(--theme-text)',
        }}>
          {mainPart}
        </div>
        <div style={{
          fontSize: '11px',
          fontWeight: '500',
          color: 'var(--theme-elevation-500)',
          letterSpacing: '0.5px',
          textTransform: 'uppercase'
        }}>
          {subPart}
        </div>
      </div>
    </div>
  )
}

export default Logo
