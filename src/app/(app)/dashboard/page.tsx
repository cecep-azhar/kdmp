'use client'

import React, { useEffect, useState } from 'react'

interface MemberData {
  fullName: string
  memberId: string
  membershipStatus: string
  summary: {
    totalSavingsTransactions: number
    activeLoans: Array<{
      loanId: string
      amount: number
      status: string
      remainingBalance: number
    }>
  }
}

export default function MemberDashboard() {
  const [data, setData] = useState<MemberData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/members/me')
        const json = await res.json()
        if (json.success) setData(json.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num)
  }

  if (loading) return <div>Memuat data dashboard...</div>

  return (
    <div>
      {/* Header Section */}
      <div style={{
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#0F172A',
            margin: '0',
          }}>
            👋 Selamat datang, {data?.fullName}
          </h1>
          <p style={{ color: '#64748B', fontSize: '15px', marginTop: '4px' }}>
            ID Anggota: <span style={{ fontWeight: '600', color: '#EF4444' }}>{data?.memberId}</span>
          </p>
        </div>
        <div style={{
          background: data?.membershipStatus === 'active' ? '#DCFCE7' : '#FEE2E2',
          color: data?.membershipStatus === 'active' ? '#166534' : '#991B1B',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: '600',
        }}>
          ● Status: {data?.membershipStatus === 'active' ? 'Aktif' : 'Tidak Aktif'}
        </div>
      </div>

      {/* Overview Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
        marginBottom: '40px',
      }}>
        <div style={statCardStyle}>
          <div style={iconBoxStyle('linear-gradient(135deg, #10B981, #34D399)')}>💰</div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '13px', color: '#64748B' }}>Total Simpanan</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A' }}>
              {data?.summary.totalSavingsTransactions || 0} <span style={{ fontSize: '12px', fontWeight: '400' }}>kali</span>
            </div>
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={iconBoxStyle('linear-gradient(135deg, #F59E0B, #FBBF24)')}>📝</div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '13px', color: '#64748B' }}>Pinjaman Aktif</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A' }}>
              {data?.summary.activeLoans.length || 0} <span style={{ fontSize: '12px', fontWeight: '400' }}>pengajuan</span>
            </div>
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={iconBoxStyle('linear-gradient(135deg, #3B82F6, #60A5FA)')}>🛍️</div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '13px', color: '#64748B' }}>Total Belanja Toko</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A' }}>
              Rp 0
            </div>
          </div>
        </div>
        
        <div style={statCardStyle}>
          <div style={iconBoxStyle('linear-gradient(135deg, #8B5CF6, #A78BFA)')}>📊</div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '13px', color: '#64748B' }}>SHU Estimasi</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A' }}>
              Rp 0
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Loans Table */}
        <div style={tableContainerStyle}>
          <div style={tableHeaderStyle}>
            📋 Pinjaman Aktif
          </div>
          <div style={{ padding: '20px' }}>
            {data?.summary.activeLoans && data.summary.activeLoans.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={thStyle}>No. Pinjaman</th>
                    <th style={thStyle}>Jumlah</th>
                    <th style={thStyle}>Sisa Hutang</th>
                    <th style={thStyle}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.summary.activeLoans.map((loan) => (
                    <tr key={loan.loanId} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={tdStyle}>{loan.loanId}</td>
                      <td style={tdStyle}>{formatCurrency(loan.amount)}</td>
                      <td style={tdStyle}>{formatCurrency(loan.remainingBalance || 0)}</td>
                      <td style={tdStyle}>
                        <span style={statusBadgeStyle(loan.status)}>
                          {loan.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: '#94A3B8', textAlign: 'center', padding: '24px' }}>
                Tidak ada pinjaman aktif.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div style={tableContainerStyle}>
          <div style={tableHeaderStyle}>
            ⚡ Aksi Cepat
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a href="/dashboard/loans/apply" style={actionButtonStyle}>
              📝 Ajukan Pinjaman Baru
            </a>
            <a href="/dashboard/savings/deposit" style={actionButtonStyle}>
              💵 Informasi Setoran
            </a>
            <a href="/dashboard/shop" style={actionButtonStyle}>
              🛒 Belanja di Toko Koperasi
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

const statCardStyle = {
  background: '#FFFFFF',
  padding: '24px',
  borderRadius: '16px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
  border: '1px solid #E2E8F0',
}

const iconBoxStyle = (bg: string) => ({
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  background: bg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  color: 'white'
})

const tableContainerStyle = {
  background: '#FFFFFF',
  borderRadius: '16px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
  border: '1px solid #E2E8F0',
  overflow: 'hidden',
}

const tableHeaderStyle = {
  padding: '16px 20px',
  borderBottom: '1px solid #E2E8F0',
  fontWeight: '700',
  fontSize: '15px',
  color: '#0F172A',
}

const thStyle = {
  padding: '12px 8px',
  fontSize: '13px',
  color: '#64748B',
  fontWeight: '600',
}

const tdStyle = {
  padding: '14px 8px',
  fontSize: '14px',
  color: '#0F172A',
}

const statusBadgeStyle = (status: string) => ({
  padding: '4px 10px',
  borderRadius: '12px',
  fontSize: '11px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  background:
    status === 'active' ? '#DCFCE7' :
    status === 'pending' ? '#FEF9C3' :
    status === 'approved' ? '#DBEAFE' : '#F1F5F9',
  color:
    status === 'active' ? '#166534' :
    status === 'pending' ? '#854D0E' :
    status === 'approved' ? '#1E40AF' : '#475569',
})

const actionButtonStyle = {
  padding: '12px 16px',
  borderRadius: '12px',
  border: '1px solid #E2E8F0',
  background: '#FFFFFF',
  color: '#0F172A',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  transition: 'all 0.2s',
  cursor: 'pointer',
}
