export const runtime = 'nodejs'
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

interface AccountDoc {
  code: string
  name: string
  type: string
  normalBalance?: string
}

interface LedgerEntry {
  entries?: Array<{
    account?: string
    debit?: number
    credit?: number
  }>
}

export const GET = async () => {
  const payload = await getPayload({ config })

  try {
    // 1. Ambil semua akun
    const accounts = await payload.find({
      collection: 'accounts',
      limit: 0,
      sort: 'code',
    }) as { docs: AccountDoc[] }

    // 2. Ambil semua entri ledger
    const ledgerEntries = await payload.find({
      collection: 'ledger',
      limit: 0,
    }) as { docs: LedgerEntry[] }

    // 3. Hitung saldo per akun
    const balances: Record<string, number> = {}

    // Build lookup map first - O(n) instead of O(n*m) for each find
    const accountMap = new Map<string, AccountDoc>()
    accounts.docs.forEach((acc) => {
      accountMap.set(acc.code, acc)
      balances[acc.code] = 0
    })

    // Agregasi dari ledger - O(m) with O(1) lookups
    ledgerEntries.docs.forEach((entry) => {
      if (entry.entries && Array.isArray(entry.entries)) {
        entry.entries.forEach((subEntry) => {
          const accCode = subEntry.account
          if (!accCode) return

          const debit = subEntry.debit || 0
          const credit = subEntry.credit || 0

          if (balances[accCode] !== undefined) {
            const account = accountMap.get(accCode)
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
      assets: accounts.docs
        .filter((a) => a.type === 'asset')
        .map((a) => ({
          code: a.code,
          name: a.name,
          balance: balances[a.code] || 0,
        })),
      liabilities: accounts.docs
        .filter((a) => a.type === 'liability')
        .map((a) => ({
          code: a.code,
          name: a.name,
          balance: balances[a.code] || 0,
        })),
      equity: accounts.docs
        .filter((a) => a.type === 'equity')
        .map((a) => ({
          code: a.code,
          name: a.name,
          balance: balances[a.code] || 0,
        })),
      totalAssets: accounts.docs
        .filter((a) => a.type === 'asset')
        .reduce((sum, a) => sum + (balances[a.code] || 0), 0),
      totalLiabilities: accounts.docs
        .filter((a) => a.type === 'liability')
        .reduce((sum, a) => sum + (balances[a.code] || 0), 0),
      totalEquity: accounts.docs
        .filter((a) => a.type === 'equity')
        .reduce((sum, a) => sum + (balances[a.code] || 0), 0),
    }

    return NextResponse.json({ success: true, data: report })
  } catch (error) {
    console.error('Report API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
