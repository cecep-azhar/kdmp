'use client'

import React, { useEffect, useState } from 'react'

interface ReportData {
  totalRevenue: number
  totalInterest: number
  totalSales: number
  totalExpenses: number
  shu: number
  memberCount: number
  loanCount: number
  transactionCount: number
  revenueByMonth: { month: string; amount: number }[]
}

const ReportsView = () => {
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/stats?reports=true')
        if (res.ok) {
          const result = await res.json()
          setData(result.reports)
        }
      } catch (error) {
        console.error('Failed to fetch reports:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num)
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Memuat Laporan Bisnis...</div>

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>📊 Laporan Bisnis & SHU</h1>
        <p style={{ color: 'var(--theme-elevation-500)' }}>Analisis performa koperasi dan perhitungan Sisa Hasil Usaha (SHU)</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '24px',
        marginBottom: '40px' 
      }}>
        {/* Total Pendapatan */}
        <div style={{
          background: 'var(--theme-elevation-50)',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid var(--theme-elevation-150)',
        }}>
          <div style={{ fontSize: '14px', color: 'var(--theme-elevation-500)', marginBottom: '8px' }}>Total Pendapatan</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#10B981' }}>{formatCurrency(data?.totalRevenue || 0)}</div>
          <div style={{ fontSize: '12px', marginTop: '8px', color: 'var(--theme-elevation-400)' }}>
            Interest: {formatCurrency(data?.totalInterest || 0)} | POS: {formatCurrency(data?.totalSales || 0)}
          </div>
        </div>

        {/* Total Beban (Dummy for now) */}
        <div style={{
          background: 'var(--theme-elevation-50)',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid var(--theme-elevation-150)',
        }}>
          <div style={{ fontSize: '14px', color: 'var(--theme-elevation-500)', marginBottom: '8px' }}>Total Beban & Biaya</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#EF4444' }}>{formatCurrency(data?.totalExpenses || 0)}</div>
          <div style={{ fontSize: '12px', marginTop: '8px', color: 'var(--theme-elevation-400)' }}>
            Operasional & Administrasi
          </div>
        </div>

        {/* SHU */}
        <div style={{
          background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
          padding: '24px',
          borderRadius: '16px',
          color: 'white',
          boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)',
        }}>
          <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>Sisa Hasil Usaha (SHU)</div>
          <div style={{ fontSize: '32px', fontWeight: '800' }}>{formatCurrency(data?.shu || 0)}</div>
          <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.9 }}>
            Laba bersih yang siap dibagikan
          </div>
        </div>
      </div>

      {/* Detail Table */}
      <div style={{
        background: 'var(--theme-elevation-50)',
        borderRadius: '16px',
        border: '1px solid var(--theme-elevation-150)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--theme-elevation-150)', fontWeight: '600' }}>
          📈 Rincian Performa per Departemen
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--theme-elevation-100)', textAlign: 'left' }}>
              <th style={{ padding: '16px 24px', fontSize: '13px' }}>Departemen</th>
              <th style={{ padding: '16px 24px', fontSize: '13px' }}>Volume Transaksi</th>
              <th style={{ padding: '16px 24px', fontSize: '13px' }}>Total Pendapatan</th>
              <th style={{ padding: '16px 24px', fontSize: '13px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '16px 24px' }}>Simpan Pinjam (Bunga)</td>
              <td style={{ padding: '16px 24px' }}>{data?.loanCount} Pinjaman Aktif</td>
              <td style={{ padding: '16px 24px' }}>{formatCurrency(data?.totalInterest || 0)}</td>
              <td style={{ padding: '16px 24px' }}><span style={{ color: '#10B981' }}>● Sehat</span></td>
            </tr>
            <tr style={{ borderTop: '1px solid var(--theme-elevation-100)' }}>
              <td style={{ padding: '16px 24px' }}>Unit Toko / POS</td>
              <td style={{ padding: '16px 24px' }}>{data?.transactionCount} Transaksi</td>
              <td style={{ padding: '16px 24px' }}>{formatCurrency(data?.totalSales || 0)}</td>
              <td style={{ padding: '16px 24px' }}><span style={{ color: '#10B981' }}>● Sehat</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '12px', color: 'var(--theme-elevation-400)' }}>
        Laporan digenerate otomatis berdasarkan data real-time sistem SIKDM.
      </div>
    </div>
  )
}

export default ReportsView
