import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export const GET = async () => {
  const payload = await getPayload({ config })

  try {
    // 1. Ambil semua akun
    const accounts = await payload.find({
      collection: 'accounts',
      limit: 0,
      sort: 'code',
    })

    // 2. Ambil semua entri ledger
    const ledgerEntries = await payload.find({
      collection: 'ledger',
      limit: 0,
    })

    // 3. Hitung saldo per akun
    const balances: Record<string, number> = {}
    
    // Inisialisasi saldo 0
    accounts.docs.forEach((acc: any) => {
      balances[acc.code] = 0
    })

    // Agregasi dari ledger
    ledgerEntries.docs.forEach((entry: any) => {
      if (entry.entries && Array.isArray(entry.entries)) {
        entry.entries.forEach((subEntry: any) => {
          const accCode = subEntry.account
          const debit = subEntry.debit || 0
          const credit = subEntry.credit || 0
          
          if (balances[accCode] !== undefined) {
            // Cari tipe akun untuk menentukan arah saldo
            const account = accounts.docs.find((a: any) => a.code === accCode)
            if (account) {
              if (account.normalBalance === 'debit') {
                balances[accCode] += (debit - credit)
              } else {
                balances[accCode] += (credit - debit)
              }
            }
          }
        })
      }
    })

    // 4. Kelompokkan berdasarkan tipe (Aset, Kewajiban, Ekuitas)
    const report = {
      assets: accounts.docs.filter((a: any) => a.type === 'asset').map((a: any) => ({
        code: a.code,
        name: a.name,
        balance: balances[a.code] || 0
      })),
      liabilities: accounts.docs.filter((a: any) => a.type === 'liability').map((a: any) => ({
        code: a.code,
        name: a.name,
        balance: balances[a.code] || 0
      })),
      equity: accounts.docs.filter((a: any) => a.type === 'equity').map((a: any) => ({
        code: a.code,
        name: a.name,
        balance: balances[a.code] || 0
      })),
      totalAssets: accounts.docs.filter((a: any) => a.type === 'asset').reduce((sum: number, a: any) => sum + (balances[a.code] || 0), 0),
      totalLiabilities: accounts.docs.filter((a: any) => a.type === 'liability').reduce((sum: number, a: any) => sum + (balances[a.code] || 0), 0),
      totalEquity: accounts.docs.filter((a: any) => a.type === 'equity').reduce((sum: number, a: any) => sum + (balances[a.code] || 0), 0),
    }

    return NextResponse.json({ success: true, data: report })
  } catch (error) {
    console.error('Report API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
