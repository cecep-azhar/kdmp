import React from 'react'

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: '#FFFFFF',
      padding: '20px',
    }}>
      {/* Logo */}
      <div style={{
        width: '100px',
        height: '100px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, #DC2626, #EF4444)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        fontWeight: 'bold',
        marginBottom: '32px',
        boxShadow: '0 20px 60px rgba(220, 38, 38, 0.3)',
      }}>
        🏛️
      </div>

      {/* Title */}
      <h1 style={{
        fontSize: '40px',
        fontWeight: '800',
        margin: '0 0 8px',
        background: 'linear-gradient(135deg, #FFFFFF, #94A3B8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center',
      }}>
        SIKDMP<br/>Koperasi Desa Merah Putih
      </h1>

      <p style={{
        fontSize: '18px',
        color: '#94A3B8',
        margin: '0 0 48px',
        textAlign: 'center',
        maxWidth: '500px',
        lineHeight: '1.6',
      }}>
        Sistem Informasi Digital untuk Manajemen Koperasi yang Modern, Transparan, dan Terpercaya
      </p>

      {/* Feature Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        maxWidth: '900px',
        width: '100%',
        marginBottom: '48px',
      }}>
        {[
          { icon: '💰', title: 'Simpan Pinjam', desc: 'Kelola simpanan & pinjaman anggota' },
          { icon: '📊', title: 'Akuntansi', desc: 'Laporan keuangan terintegrasi' },
          { icon: '🛒', title: 'Point of Sale', desc: 'Penjualan barang koperasi' },
          { icon: '📚', title: '9 Buku Koperasi', desc: 'Standar pelaporan koperasi' },
        ].map((feature) => (
          <div key={feature.title} style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>{feature.icon}</div>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
              {feature.title}
            </div>
            <div style={{ fontSize: '13px', color: '#94A3B8' }}>{feature.desc}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <a
        href="/admin"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '16px 32px',
          background: 'linear-gradient(135deg, #DC2626, #EF4444)',
          color: '#FFFFFF',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          textDecoration: 'none',
          boxShadow: '0 8px 32px rgba(220, 38, 38, 0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
      >
        🔑 Masuk ke Admin Panel
      </a>

      {/* Footer */}
      <div style={{
        marginTop: '64px',
        fontSize: '13px',
        color: '#475569',
        textAlign: 'center',
        lineHeight: '1.8'
      }}>
        <div>Dibuat dengan ❤️ di Bandung, Indonesia — <strong style={{ color: '#94A3B8' }}>Cecep Azhar</strong> &copy; {new Date().getFullYear()}</div>
        <div style={{ marginTop: '4px' }}>
          <a
            href="https://cecepazhar.com/support"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#3B82F6',
              textDecoration: 'underline',
              fontWeight: '500',
            }}
          >
            Traktir kopi ☕
          </a>
        </div>
      </div>
    </div>
  )
}
