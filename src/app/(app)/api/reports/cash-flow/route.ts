export const runtime = 'edge'
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getYearRange } from '../../../../../utils/date'

/**
 * GET /api/reports/cash-flow
 * Laporan Arus Kas untuk periode tertentu
 */
export async function GET(request: Request) {
  const payload = await getPayload({ config })
  const { searchParams } = new URL(request.url)

  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString(), 10)
  const { start: startDate, end: endDate } = getYearRange(year)

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
    }) as { docs: Array<{ date: string; description: string; entries: Array<{ account: string; debit: number; credit: number }>; journalType?: string }> }

    // 2. Ambil data accounts untuk mapping
    const accounts = await payload.find({
      collection: 'accounts',
      limit: 0,
    }) as { docs: Array<{ code: string; name: string; type: string }> }

    const accountMap = new Map<string, { name: string; type: string }>()
    accounts.docs.forEach((acc) => {
      accountMap.set(acc.code, { name: acc.name, type: acc.type })
    })

    // 3. Aggregate cash flows
    // Cash inflow = semua yang debit ke account 1-1001 (Kas) atau 1-1002 (Bank)
    // Cash outflow = semua yang credit dari account 1-1001 (Kas) atau 1-1002 (Bank)

    const cashAccounts = ['1-1001', '1-1002'] // Kas dan Bank

    let cashInflow = 0
    let cashOutflow = 0
    const transactions: Array<{
      date: string
      description: string
      type: 'inflow' | 'outflow'
      amount: number
      account: string
    }> = []

    ledgerEntries.docs.forEach((entry) => {
      entry.entries?.forEach((subEntry) => {
        if (!subEntry.account) return

        const isCashAccount = cashAccounts.includes(subEntry.account)
        if (!isCashAccount) return

        const debit = subEntry.debit || 0
        const credit = subEntry.credit || 0

        if (debit > 0) {
          // Kas/Bank bertambah (inflow)
          cashInflow += debit
          transactions.push({
            date: entry.date,
            description: entry.description || ' transaksi',
            type: 'inflow',
            amount: debit,
            account: subEntry.account,
          })
        } else if (credit > 0) {
          // Kas/Bank berkurang (outflow)
          cashOutflow += credit
          transactions.push({
            date: entry.date,
            description: entry.description || ' transaksi',
            type: 'outflow',
            amount: credit,
            account: subEntry.account,
          })
        }
      })
    })

    // 4. Kategorikan berdasarkan journal type
    const cashInflowByType: Record<string, number> = {
      'cash-in': 0,
      'loan-disbursement': 0,
      'savings-deposit': 0,
      'other': 0,
    }

    const cashOutflowByType: Record<string, number> = {
      'cash-out': 0,
      'loan-repayment': 0,
      'savings-withdrawal': 0,
      'expense': 0,
      'other': 0,
    }

    // 5. Calculate net change
    const netCashFlow = cashInflow - cashOutflow

    // 6. Get opening balance (saldo awal tahun)
    const openingBalanceEntries = await payload.find({
      collection: 'ledger',
      where: {
        date: { less_than: startDate },
      },
      limit: 0,
    }) as { docs: Array<{ entries: Array<{ account: string; debit: number; credit: number }> }> }

    let openingBalance = 0
    openingBalanceEntries.docs.forEach((entry) => {
      entry.entries?.forEach((subEntry) => {
        if (cashAccounts.includes(subEntry.account)) {
          openingBalance += (subEntry.debit || 0) - (subEntry.credit || 0)
        }
      })
    })

    // 7. Calculate closing balance
    const closingBalance = openingBalance + netCashFlow

    return NextResponse.json({
      success: true,
      data: {
        period: { year, startDate, endDate },
        summary: {
          openingBalance,
          cashInflow,
          cashOutflow,
          netCashFlow,
          closingBalance,
        },
        breakdown: {
          inflow: cashInflowByType,
          outflow: cashOutflowByType,
        },
        transactions: transactions.slice(0, 100), // Limit to 100 recent transactions
      },
    })
  } catch (error) {
    console.error('Cash Flow API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}