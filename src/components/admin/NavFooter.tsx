import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

const NavFooter = async () => {
  const payload = await getPayload({ config: configPromise })
  // @ts-ignore - types may not be generated yet
  const settings = await payload.findGlobal({ slug: 'settings' }) as any
  const appName = settings?.appName || 'SIKDMP Sistem Informasi Koperasi Desa Merah Putih'

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
        {appName}
      </div>
      <div>Sistem Informasi Digital</div>
      <div style={{ marginTop: '4px' }}>v1.0.0</div>
    </div>
  )
}

export default NavFooter
