'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoanApplyPage() {
  const [amount, setAmount] = useState(1000000)
  const [tenor, setTenor] = useState(12)
  const [purpose, setPurpose] = useState('productive')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  // Simulasi kalkulasi
  const interestRate = 12 // 12% per tahun
  const monthlyInterest = (amount * (interestRate / 100)) / 12
  const monthlyPrincipal = amount / tenor
  const totalMonthly = monthlyPrincipal + monthlyInterest

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const res = await fetch('/api/loan-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Payload 3.0 auth uses cookies, but the API expects Authorization header or it might fail
          // We'll try to let the browser send cookies automatically
        },
        body: JSON.stringify({
          amount,
          tenor,
          purpose,
          purposeDescription: description,
          interestRate,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('Pengajuan Anda berhasil dikirim! Mengalihkan...')
        setTimeout(() => router.push('/dashboard'), 2000)
      } else {
        setError(data.error || 'Gagal mengirim pengajuan')
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0F172A' }}>🚀 Pengajuan Pinjaman Baru</h1>
        <p style={{ color: '#64748B', marginTop: '4px' }}>Isi formulir di bawah ini untuk mengajukan pinjaman koperasi.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
        {/* Form Section */}
        <form onSubmit={handleSubmit} style={cardStyle}>
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Jumlah Pinjaman (Rp)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={500000}
              step={100000}
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Tenor (Bulan)</label>
            <select
              value={tenor}
              onChange={(e) => setTenor(Number(e.target.value))}
              style={inputStyle}
              required
            >
              {[3, 6, 12, 18, 24, 36].map(t => (
                <option key={t} value={t}>{t} Bulan</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Tujuan Pinjaman</label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              style={inputStyle}
              required
            >
              <option value="productive">Produktif / Usaha</option>
              <option value="consumptive">Konsumtif</option>
              <option value="education">Pendidikan</option>
              <option value="health">Kesehatan</option>
              <option value="other">Lainnya</option>
            </select>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={labelStyle}>Keterangan Tambahan</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
              placeholder="Jelaskan detail penggunaan dana..."
            />
          </div>

          {error && <div style={{ color: '#EF4444', fontSize: '14px', marginBottom: '16px' }}>❌ {error}</div>}
          {message && <div style={{ color: '#10B981', fontSize: '14px', marginBottom: '16px' }}>✅ {message}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              background: loading ? '#94A3B8' : 'linear-gradient(135deg, #DC2626, #EF4444)',
              color: 'white',
              border: 'none',
              fontWeight: '600',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 10px 15px -3px rgba(220, 38, 38, 0.2)'
            }}
          >
            {loading ? 'Mengirim...' : 'Kirim Pengajuan'}
          </button>
        </form>

        {/* Summary / Calculator Section */}
        <div style={{ ...cardStyle, background: '#F8FAFC', alignSelf: 'start' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#0F172A' }}>📊 Simulasi Angsuran</h3>
          
          <div style={simRowStyle}>
            <span>Pokok Bulanan</span>
            <span style={{ fontWeight: '600' }}>{new Intl.NumberFormat('id-ID').format(Math.round(monthlyPrincipal))}</span>
          </div>
          
          <div style={simRowStyle}>
            <span>Bunga Bulanan (1%)</span>
            <span style={{ fontWeight: '600' }}>{new Intl.NumberFormat('id-ID').format(Math.round(monthlyInterest))}</span>
          </div>
          
          <div style={{ ...simRowStyle, borderTop: '1px solid #E2E8F0', paddingTop: '12px', marginTop: '12px' }}>
            <span style={{ fontWeight: '700', color: '#0F172A' }}>Total per Bulan</span>
            <span style={{ fontWeight: '800', color: '#EF4444', fontSize: '18px' }}>
              Rp {new Intl.NumberFormat('id-ID').format(Math.round(totalMonthly))}
            </span>
          </div>

          <div style={{ marginTop: '24px', padding: '12px', background: '#FEF2F2', borderRadius: '8px', fontSize: '12px', color: '#991B1B', lineHeight: '1.5' }}>
            ⚠️ <strong>Catatan:</strong> Ini adalah simulasi awal. Persetujuan akhir dan suku bunga tetap ditentukan oleh pengurus koperasi.
          </div>
        </div>
      </div>
    </div>
  )
}

const cardStyle = {
  background: 'white',
  padding: '32px',
  borderRadius: '20px',
  border: '1px solid #E2E8F0',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
}

const labelStyle = {
  display: 'block',
  fontSize: '14px',
  fontWeight: '600',
  color: '#475569',
  marginBottom: '8px',
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  border: '1px solid #E2E8F0',
  fontSize: '15px',
  color: '#1E293B',
  outline: 'none',
  transition: 'border-color 0.2s',
}

const simRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '14px',
  color: '#64748B',
  marginBottom: '8px',
}
