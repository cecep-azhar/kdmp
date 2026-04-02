import React from 'react'

const NavFooter = () => {
  return (
    <div style={{
      padding: '16px 20px',
      borderTop: '1px solid var(--theme-elevation-150)',
      marginTop: 'auto',
      fontSize: '11px',
      color: 'var(--theme-elevation-400)',
      textAlign: 'center',
      lineHeight: '1.5',
    }}>
      <div style={{ fontWeight: '600', color: 'var(--theme-elevation-500)' }}>
        Koperasi Merah Putih
      </div>
      <div>Sistem Informasi Digital</div>
      <div style={{ marginTop: '4px' }}>v1.0.0</div>
    </div>
  )
}

export default NavFooter
