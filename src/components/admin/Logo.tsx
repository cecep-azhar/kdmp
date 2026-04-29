'use client'

import React from 'react'

/**
 * KMP Logo Component
 * Represents: Kopi Desa Merah Putih - Merah dan Putih theme
 */
const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0',
      }}
      className={className}
    >
      {/* SVG Logo - Merah Putih theme */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width="40"
        height="40"
        style={{ borderRadius: '10px' }}
      >
        {/* Background circle - Merah */}
        <circle cx="50" cy="50" r="48" fill="#DC2626" />
        {/* White inner ring */}
        <circle cx="50" cy="50" r="38" fill="#FFFFFF" />
        {/* Red center circle */}
        <circle cx="50" cy="50" r="28" fill="#DC2626" />
        {/* KMP text */}
        <text
          x="50"
          y="56"
          fontFamily="Arial, sans-serif"
          fontSize="22"
          fontWeight="bold"
          fill="#FFFFFF"
          textAnchor="middle"
        >
          KMP
        </text>
      </svg>

      <div>
        <div style={{
          fontSize: '16px',
          fontWeight: '700',
          lineHeight: '1.2',
          color: 'var(--theme-text)',
        }}>
          KMP
        </div>
        <div style={{
          fontSize: '11px',
          fontWeight: '500',
          color: 'var(--theme-elevation-500)',
          letterSpacing: '0.5px',
          textTransform: 'uppercase'
        }}>
          Kopi Desa Merah Putih
        </div>
      </div>
    </div>
  )
}

export default Logo