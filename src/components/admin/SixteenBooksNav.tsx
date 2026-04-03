import Link from 'next/link'
import React from 'react'

export const SixteenBooksNav: React.FC = () => {
  const linkStyle = {
    display: 'block',
    padding: '8px calc(var(--base) * 1.5)',
    color: 'var(--theme-elevation-800)',
    textDecoration: 'none',
    fontSize: '0.86rem',
    opacity: 0.8,
    transition: 'all 0.2s ease'
  }

  const groupStyle = {
    marginBottom: '20px',
    borderTop: '1px solid var(--theme-elevation-200)',
    paddingTop: '20px'
  }

  const headerStyle = {
    fontSize: '11px',
    textTransform: 'uppercase' as const,
    color: 'var(--theme-elevation-400)',
    margin: '0 0 10px 0',
    paddingLeft: 'calc(var(--base) * 1.5)',
    fontWeight: 'bold',
    letterSpacing: '0.05em'
  }

  return (
    <div style={groupStyle} className="nav-group">
      <h4 style={headerStyle}>16 Buku Administrasi</h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li><Link href="/admin/collections/members" style={linkStyle}>1) Buku Daftar Anggota</Link></li>
        <li><Link href="/admin/collections/board-members" style={linkStyle}>2) Buku Daftar Pengurus</Link></li>
        <li><Link href="/admin/collections/supervisors" style={linkStyle}>3) Buku Daftar Pengawas</Link></li>
        <li><Link href="/admin/collections/employees" style={linkStyle}>4) Buku Daftar Karyawan</Link></li>
        <li><Link href="/admin/collections/guest-book" style={linkStyle}>5) Buku Tamu</Link></li>
        <li><Link href="/admin/collections/savings" style={linkStyle}>6) Buku Simpanan Anggota</Link></li>
        <li><Link href="/admin/collections/suggestions?where[or][0][and][0][category][equals]=member" style={linkStyle}>7) Buku Saran Anggota</Link></li>
        <li><Link href="/admin/collections/suggestions?where[or][0][and][0][category][equals]=officer" style={linkStyle}>8) Buku Anjuran Pejabat</Link></li>
        <li><Link href="/admin/collections/suggestions?where[or][0][and][0][category][equals]=external_officer" style={linkStyle}>9) Buku Anjuran Pejabat Instansi Lain</Link></li>
        <li><Link href="/admin/collections/meetings?where[or][0][and][0][meetingType][equals]=supervisor" style={linkStyle}>10) Buku Keputusan Rapat Pengawas</Link></li>
        <li><Link href="/admin/collections/meetings?where[or][0][and][0][meetingType][equals]=board" style={linkStyle}>11) Buku Keputusan Rapat Pengurus</Link></li>
        <li><Link href="/admin/collections/meetings?where[or][0][and][0][meetingType][equals]=member" style={linkStyle}>12) Buku Keputusan Rapat Anggota</Link></li>
        <li><Link href="/admin/collections/logs" style={linkStyle}>13) Buku Kejadian Penting</Link></li>
        <li><Link href="/admin/collections/ledger" style={linkStyle}>14) Buku Kas</Link></li>
        <li><Link href="/admin/collections/assets" style={linkStyle}>15) Buku Catatan Inventaris</Link></li>
        <li><Link href="/admin/collections/mail-log" style={linkStyle}>16) Buku Agenda</Link></li>
      </ul>
    </div>
  )
}
