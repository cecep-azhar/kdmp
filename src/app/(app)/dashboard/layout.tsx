'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/users/me')
        const data = await res.json()
        
        if (!res.ok || !data.user) {
          router.push('/login')
        } else {
          setUser(data.user)
          setLoading(false)
        }
      } catch (err) {
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/users/logout', { method: 'POST' })
    router.push('/login')
  }

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      background: '#0F172A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#94A3B8',
      fontFamily: "'Inter', sans-serif"
    }}>
      Memverifikasi akses...
    </div>
  )

  const navItems = [
    { label: 'Beranda', href: '/dashboard', icon: '🏠' },
    { label: 'Simpanan', href: '/dashboard/savings', icon: '💰' },
    { label: 'Pinjaman', href: '/dashboard/loans', icon: '📝' },
    { label: 'Toko (POS)', href: '/dashboard/shop', icon: '🛒' },
    { label: 'Profil', href: '/dashboard/profile', icon: '👤' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFC',
      display: 'flex',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '280px',
        background: '#0F172A',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 24px',
        position: 'fixed',
        height: '100vh',
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '48px',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #DC2626, #EF4444)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
          }}>
            🏛️
          </div>
          <div style={{ fontWeight: '700', fontSize: '18px' }}>
            KDMP <span style={{ color: '#EF4444' }}>Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: '1' }}>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                color: pathname === item.href ? '#FFFFFF' : '#94A3B8',
                background: pathname === item.href ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                textDecoration: 'none',
                marginBottom: '8px',
                fontSize: '15px',
                fontWeight: pathname === item.href ? '600' : '400',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (pathname !== item.href) e.currentTarget.style.color = '#FFFFFF'
              }}
              onMouseLeave={(e) => {
                if (pathname !== item.href) e.currentTarget.style.color = '#94A3B8'
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF' }}>{user.name}</div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>{user.email}</div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FCA5A5',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        marginLeft: '280px',
        flex: '1',
        padding: '40px',
      }}>
        {children}
      </main>
    </div>
  )
}
