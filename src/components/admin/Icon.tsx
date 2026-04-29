import React from 'react'

/**
 * KMP Icon Component - SVG based icon
 */
const Icon = ({ size = 24 }: { size?: number }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width={size}
        height={size}
      >
        {/* Background circle - Merah */}
        <circle cx="16" cy="16" r="15" fill="#DC2626" />
        {/* White ring */}
        <circle cx="16" cy="16" r="11" fill="#FFFFFF" />
        {/* Red center */}
        <circle cx="16" cy="16" r="7" fill="#DC2626" />
        {/* K text */}
        <text
          x="16"
          y="19"
          fontFamily="Arial, sans-serif"
          fontSize="8"
          fontWeight="bold"
          fill="#FFFFFF"
          textAnchor="middle"
        >
          K
        </text>
      </svg>
    </div>
  )
}

export default Icon