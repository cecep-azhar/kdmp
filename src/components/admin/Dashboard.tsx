'use client'

import React, { useEffect, useState } from 'react'

interface DashboardStats {
  totalMembers: number
  activeMembers: number
  totalSavings: number
  totalLoans: number
  pendingLoans: number
  activeLoans: number
  totalProducts: number
  lowStockProducts: number
  todayTransactions: number
  todayRevenue: number
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color,
  gradient,
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: string
  color: string
  gradient: string
}) => (
  <div style={{
    background: 'var(--theme-elevation-50)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid var(--theme-elevation-100)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'default',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-2px)'
    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)'
    e.currentTarget.style.boxShadow = 'none'
  }}
  >
    <div style={{
      position: 'absolute',
      top: '-10px',
      right: '-10px',
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: gradient,
      opacity: 0.1,
    }} />
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '16px',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
      }}>
        {icon}
      </div>
    </div>
    <div style={{
      fontSize: '28px',
      fontWeight: '700',
      color: 'var(--theme-text)',
      lineHeight: '1',
      marginBottom: '4px',
    }}>
      {value}
    </div>
    <div style={{
      fontSize: '13px',
      fontWeight: '500',
      color: 'var(--theme-elevation-500)',
      marginBottom: subtitle ? '4px' : '0',
    }}>
      {title}
    </div>
    {subtitle && (
      <div style={{
        fontSize: '11px',
        color,
        fontWeight: '600',
      }}>
        {subtitle}
      </div>
    )}
  </div>
)

const QuickAction = ({
  title,
  href,
  icon,
  description,
}: {
  title: string
  href: string
  icon: string
  description: string
}) => (
  <a
    href={href}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px 20px',
      background: 'var(--theme-elevation-50)',
      borderRadius: '12px',
      border: '1px solid var(--theme-elevation-100)',
      textDecoration: 'none',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'var(--theme-elevation-100)'
      e.currentTarget.style.transform = 'translateX(4px)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'var(--theme-elevation-50)'
      e.currentTarget.style.transform = 'translateX(0)'
    }}
  >
    <span style={{ fontSize: '28px' }}>{icon}</span>
    <div>
      <div style={{
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--theme-text)',
        marginBottom: '2px',
      }}>
        {title}
      </div>
      <div style={{
        fontSize: '12px',
        color: 'var(--theme-elevation-500)',
      }}>
        {description}
      </div>
    </div>
  </a>
)

const RecentActivity = ({
  items,
}: {
  items: Array<{ text: string; time: string; type: string }>
}) => (
  <div style={{
    background: 'var(--theme-elevation-50)',
    borderRadius: '16px',
    border: '1px solid var(--theme-elevation-100)',
    overflow: 'hidden',
  }}>
    <div style={{
      padding: '20px 24px',
      borderBottom: '1px solid var(--theme-elevation-100)',
      fontWeight: '600',
      fontSize: '15px',
      color: 'var(--theme-text)',
    }}>
      📋 Aktivitas Terbaru
    </div>
    {items.map((item, index) => (
      <div
        key={index}
        style={{
          padding: '16px 24px',
          borderBottom: index < items.length - 1 ? '1px solid var(--theme-elevation-100)' : 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background:
              item.type === 'saving' ? '#10B981' :
              item.type === 'loan' ? '#F59E0B' :
              item.type === 'pos' ? '#3B82F6' : '#6B7280',
          }} />
          <span style={{
            fontSize: '13px',
            color: 'var(--theme-text)',
          }}>
            {item.text}
          </span>
        </div>
        <span style={{
          fontSize: '11px',
          color: 'var(--theme-elevation-400)',
          whiteSpace: 'nowrap',
        }}>
          {item.time}
        </span>
      </div>
    ))}
  </div>
)

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeMembers: 0,
    totalSavings: 0,
    totalLoans: 0,
    pendingLoans: 0,
    activeLoans: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    todayTransactions: 0,
    todayRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [membersRes, savingsRes, loansRes, productsRes, transactionsRes] = await Promise.all([
          fetch('/api/members?limit=0'),
          fetch('/api/savings?limit=0'),
          fetch('/api/loans?limit=0'),
          fetch('/api/products?limit=0'),
          fetch('/api/transactions?limit=0'),
        ])

        const members = await membersRes.json()
        const savings = await savingsRes.json()
        const loans = await loansRes.json()
        const products = await productsRes.json()
        const transactions = await transactionsRes.json()

        setStats({
          totalMembers: members.totalDocs || 0,
          activeMembers: members.totalDocs || 0,
          totalSavings: savings.totalDocs || 0,
          totalLoans: loans.totalDocs || 0,
          pendingLoans: 0,
          activeLoans: 0,
          totalProducts: products.totalDocs || 0,
          lowStockProducts: 0,
          todayTransactions: transactions.totalDocs || 0,
          todayRevenue: 0,
        })
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num)
  }

  const recentActivities = [
    { text: 'Dashboard sistem berhasil dimuat', time: 'Baru saja', type: 'system' },
    { text: 'Sistem siap dioperasikan', time: 'Baru saja', type: 'system' },
  ]

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 24px 40px',
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '32px',
        paddingBottom: '24px',
        borderBottom: '1px solid var(--theme-elevation-100)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '8px',
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #DC2626, #EF4444)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            color: 'white',
            fontWeight: 'bold',
          }}>
            🏛️
          </div>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'var(--theme-text)',
              margin: 0,
              lineHeight: '1.2',
            }}>
              Dashboard Koperasi Merah Putih
            </h1>
            <p style={{
              fontSize: '14px',
              color: 'var(--theme-elevation-500)',
              margin: '4px 0 0',
            }}>
              Sistem Informasi Manajemen Koperasi - {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          color: 'var(--theme-elevation-500)',
        }}>
          Memuat data dashboard...
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}>
            <StatCard
              title="Total Anggota"
              value={stats.totalMembers}
              subtitle={`${stats.activeMembers} aktif`}
              icon="👥"
              color="#10B981"
              gradient="linear-gradient(135deg, #10B981, #34D399)"
            />
            <StatCard
              title="Total Simpanan"
              value={stats.totalSavings}
              subtitle="transaksi tercatat"
              icon="💰"
              color="#3B82F6"
              gradient="linear-gradient(135deg, #3B82F6, #60A5FA)"
            />
            <StatCard
              title="Total Pinjaman"
              value={stats.totalLoans}
              subtitle={`${stats.pendingLoans} menunggu approval`}
              icon="📋"
              color="#F59E0B"
              gradient="linear-gradient(135deg, #F59E0B, #FBBF24)"
            />
            <StatCard
              title="Produk POS"
              value={stats.totalProducts}
              subtitle={stats.lowStockProducts > 0 ? `${stats.lowStockProducts} stok rendah` : 'Stok aman'}
              icon="📦"
              color={stats.lowStockProducts > 0 ? '#EF4444' : '#10B981'}
              gradient="linear-gradient(135deg, #8B5CF6, #A78BFA)"
            />
          </div>

          {/* Main Content Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
          }}>
            {/* Quick Actions */}
            <div>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--theme-text)',
                marginBottom: '16px',
              }}>
                ⚡ Aksi Cepat
              </h2>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                <QuickAction
                  title="Tambah Anggota Baru"
                  href="/admin/collections/members/create"
                  icon="👤"
                  description="Daftarkan anggota koperasi baru"
                />
                <QuickAction
                  title="Catat Simpanan"
                  href="/admin/collections/savings/create"
                  icon="💵"
                  description="Catat setoran atau penarikan simpanan"
                />
                <QuickAction
                  title="Ajukan Pinjaman"
                  href="/admin/collections/loans/create"
                  icon="📝"
                  description="Buat pengajuan pinjaman anggota"
                />
                <QuickAction
                  title="Transaksi POS"
                  href="/admin/collections/transactions/create"
                  icon="🛒"
                  description="Buat transaksi penjualan baru"
                />
                <QuickAction
                  title="Jurnal Keuangan"
                  href="/admin/collections/ledger/create"
                  icon="📊"
                  description="Catat entri jurnal akuntansi"
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--theme-text)',
                marginBottom: '16px',
              }}>
                Ringkasan
              </h2>
              <RecentActivity items={recentActivities} />

              {/* 9 Buku Koperasi Quick Links */}
              <div style={{
                marginTop: '24px',
                background: 'var(--theme-elevation-50)',
                borderRadius: '16px',
                border: '1px solid var(--theme-elevation-100)',
                padding: '20px 24px',
              }}>
                <div style={{
                  fontWeight: '600',
                  fontSize: '15px',
                  color: 'var(--theme-text)',
                  marginBottom: '16px',
                }}>
                  📚 9 Buku Koperasi
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  fontSize: '12px',
                }}>
                  {[
                    { label: '1. Buku Anggota', href: '/admin/collections/members' },
                    { label: '2. Buku Pengurus', href: '/admin/collections/users' },
                    { label: '3. Buku Pengawas', href: '/admin/collections/users' },
                    { label: '4. Buku Simpanan', href: '/admin/collections/savings' },
                    { label: '5. Buku Pinjaman', href: '/admin/collections/loans' },
                    { label: '6. Buku Inventaris', href: '/admin/collections/assets' },
                    { label: '7. Buku Kejadian', href: '/admin/collections/logs' },
                    { label: '8. Buku Tamu', href: '/admin/collections/guest-book' },
                    { label: '9. Buku Rapat', href: '/admin/collections/meetings' },
                  ].map((book) => (
                    <a
                      key={book.label}
                      href={book.href}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: 'var(--theme-text)',
                        background: 'var(--theme-elevation-0)',
                        border: '1px solid var(--theme-elevation-100)',
                        transition: 'background 0.2s',
                        fontWeight: '500',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--theme-elevation-100)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--theme-elevation-0)'
                      }}
                    >
                      {book.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
