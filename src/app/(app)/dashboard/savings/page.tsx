'use client'

import React, { useEffect, useState } from 'react'

interface SavingsTransaction {
  id: string
  savingId: string
  type: string
  transactionType: string
  amount: number
  status: string
  createdAt: string
  notes?: string
}

export default function SavingsPage() {
  const [savings, setSavings] = useState<SavingsTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        const res = await fetch('/api/savings')
        const data = await res.json()
        setSavings(data.docs || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSavings()
  }, [])

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num)
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pokok': return 'S. Pokok'
      case 'wajib': return 'S. Wajib'
      case 'sukarela': return 'S. Sukarela'
      default: return type
    }
  }

  // Group by type for totals
  const totals = savings.reduce((acc: any, curr) => {
    if (curr.status === 'completed') {
      const amount = curr.transactionType === 'deposit' ? curr.amount : -curr.amount
      acc[curr.type] = (acc[curr.type] || 0) + amount
    }
    return acc
  }, {})

  if (loading) return <div>Memuat data simpanan...</div>

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0F172A' }}>💰 Saldo Simpanan Anda</h1>
        <p style={{ color: '#64748B', marginTop: '4px' }}>Rangkuman total simpanan yang Anda miliki di koperasi.</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {['pokok', 'wajib', 'sukarela'].map(type => (
          <div key={type} style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}>
            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>
              {getTypeLabel(type)}
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', marginTop: '8px' }}>
              {formatCurrency(totals[type] || 0)}
            </div>
          </div>
        ))}
      </div>

      {/* Transaction History Table */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #F1F5F9', fontWeight: '700' }}>
          📜 Riwayat Transaksi Simpanan
        </div>
        <div style={{ padding: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #E2E8F0' }}>
                <th style={thStyle}>Tanggal</th>
                <th style={thStyle}>Tipe Transaksi</th>
                <th style={thStyle}>Kategori</th>
                <th style={thStyle}>Jumlah</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {savings.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <td style={tdStyle}>{new Date(item.createdAt).toLocaleDateString('id-ID')}</td>
                  <td style={tdStyle}>
                    <span style={{
                      color: item.transactionType === 'deposit' ? '#10B981' : '#EF4444',
                      fontWeight: '600'
                    }}>
                      {item.transactionType === 'deposit' ? '⬇️ SETOR' : '⬆️ TARIK'}
                    </span>
                  </td>
                  <td style={tdStyle}>{getTypeLabel(item.type)}</td>
                  <td style={tdStyle}>{formatCurrency(item.amount)}</td>
                  <td style={tdStyle}>
                    <span style={{
                      fontSize: '11px',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      background: item.status === 'completed' ? '#DCFCE7' : '#F1F5F9',
                      color: item.status === 'completed' ? '#166534' : '#475569',
                      fontWeight: '700'
                    }}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const thStyle = {
  padding: '12px 16px',
  fontSize: '13px',
  color: '#64748B',
  fontWeight: '600',
}

const tdStyle = {
  padding: '16px',
  fontSize: '14px',
  color: '#1E293B',
}
