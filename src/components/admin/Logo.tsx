'use client'

import React, { useEffect, useState } from 'react'

const Logo = () => {
  const [appName, setAppName] = useState('SIKDMP')
  const [primaryColor, setPrimaryColor] = useState('#DC2626')

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/globals/settings')
        if (res.ok) {
          const data = await res.json()
          if (data.appName) setAppName(data.appName)
          if (data.primaryColor) setPrimaryColor(data.primaryColor)
        }
      } catch (err) {
        console.error('Failed to load logo settings', err)
      }
    }
    fetchSettings()
  }, [])

  const nameParts = appName.split(' ')
  const mainPart = nameParts[0] || 'SIKDMP'
  const subPart = nameParts.slice(1).join(' ') || 'Koperasi Desa Merah Putih'

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
