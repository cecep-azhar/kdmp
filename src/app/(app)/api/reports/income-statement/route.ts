export const runtime = 'nodejs'
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

/**
 * GET /api/reports/income-statement
 * Laporan Laba Rugi untuk periode tertentu
 */
export async function GET(request: Request) {
  const payload = await getPayload({ config })
  const { searchParams } = new URL(request.url)

  // Get date range (default: current year)
  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString(), 10)
  const startDate = `${year}-01-01T00:00:00.000Z`
  const endDate = `${year}-12-31T23:59:59.999Z`

  try {
    // 1. Ambil semua ledger entries untuk periode
    const ledgerEntries = await payload.find({
      collection: 'ledger',
      where: {
        and: [
          { date: { greater_than_equal: startDate } },
          { date: { less_than_equal: endDate } },
        ],
      },
      limit: 0,
    }) as { docs: Array<{ entries: Array<{ account: string; debit: number; credit: number }> }> }

    // 2. Ambil data accounts untuk mapping
    const accounts = await payload.find({
      collection: 'accounts',
      limit: 0,
    }) as { docs: Array<{ code: string; name: string; type: string }> }

    const accountMap = new Map<string, { name: string; type: string }>()
    accounts.docs.forEach((acc) => {
      accountMap.set(acc.code, { name: acc.name, type: acc.type })
    })

    // 3. Aggregate saldo per akun
    const balances: Record<string, { name: string; debit: number; credit: number }> = {}
    ledgerEntries.docs.forEach((entry) => {
      entry.entries?.forEach((subEntry) => {
        if (!subEntry.account) return
        if (!balances[subEntry.account]) {
          const accInfo = accountMap.get(subEntry.account) || { name: subEntry.account, type: 'unknown' }
          balances[subEntry.account] = { name: accInfo.name, debit: 0, credit: 0 }
        }
        balances[subEntry.account].debit += subEntry.debit || 0
        balances[subEntry.account].credit += subEntry.credit || 0
      })
    })

    // 4. Kategorikan pendapatan dan beban
    const revenueAccounts: Array<{ code: string; name: string; amount: number }> = []
    const expenseAccounts: Array<{ code: string; name: string; amount: number }> = []

    Object.entries(balances).forEach(([code, data]) => {
      const netAmount = data.credit - data.debit // Credit = pendapatan, Debit = beban

      if (code.startsWith('4-')) {
        // Pendapatan (Account type 4)
        if (netAmount > 0) {
          revenueAccounts.push({ code, name: data.name, amount: netAmount })
        }
      } else if (code.startsWith('5-')) {
        // Beban (Account type 5)
        if (netAmount > 0) {
          expenseAccounts.push({ code, name: data.name, amount: netAmount })
        }
      }
    })

    // 5. Hitung totals
    const totalRevenue = revenueAccounts.reduce((sum, acc) => sum + acc.amount, 0)
    const totalExpenses = expenseAccounts.reduce((sum, acc) => sum + acc.amount, 0)
    const grossProfit = totalRevenue - totalExpenses

    // 6. Ambil settings untuk SHU calculation
    let shuSettings = { reserveRatio: 20, jasaModalRatio: 50, jasaAnggotaRatio: 50 }
    try {
      const settings = await payload.findGlobal({ slug: 'settings' }) as any
      if (settings?.shuSettings) {
        shuSettings = {
          reserveRatio: settings.shuSettings.reserveRatio || 20,
          jasaModalRatio: settings.shuSettings.jasaModalRatio || 50,
          jasaAnggotaRatio: settings.shuSettings.jasaAnggotaRatio || 50,
        }
      }
    } catch (e) {
      // Use defaults
    }

    // Calculate SHU breakdown
    const shuAmount = grossProfit
    const reserveFund = Math.round(shuAmount * (shuSettings.reserveRatio / 100))
    const distributableShu = shuAmount - reserveFund
    const jasaModalAmount = Math.round(distributableShu * (shuSettings.jasaModalRatio / 100))
    const jasaAnggotaAmount = Math.round(distributableShu * (shuSettings.jasaAnggotaRatio / 100))

    return NextResponse.json({
      success: true,
      data: {
        period: { year, startDate, endDate },
        revenue: {
          accounts: revenueAccounts,
          total: totalRevenue,
        },
        expenses: {
          accounts: expenseAccounts,
          total: totalExpenses,
        },
        summary: {
          grossProfit,
          reserveFund,
          distributableShu,
          jasaModal: jasaModalAmount,
          jasaAnggota: jasaAnggotaAmount,
        },
        shuSettings,
      },
    })
  } catch (error) {
    console.error('Income Statement API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}