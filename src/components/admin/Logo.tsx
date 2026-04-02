import React from 'react'

const Logo = () => {
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
        background: 'linear-gradient(135deg, #DC2626, #FFFFFF)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#DC2626',
        border: '2px solid #DC2626',
      }}>
        K
      </div>
      <div>
        <div style={{
          fontSize: '16px',
          fontWeight: '700',
          lineHeight: '1.2',
          color: 'var(--theme-text)',
        }}>
          Koperasi
        </div>
        <div style={{
          fontSize: '11px',
          fontWeight: '500',
          color: 'var(--theme-elevation-500)',
          letterSpacing: '0.5px',
        }}>
          MERAH PUTIH
        </div>
      </div>
    </div>
  )
}

export default Logo
