export const runtime = 'edge'
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

/**
 * GET /api/reports/export/books
 * Export data for 16 buku administration in CSV format
 *
 * Query params:
 * - book: 'members' | 'board-members' | 'supervisors' | 'employees' | 'savings' | 'loans' | 'guest-book' | 'suggestions' | 'meetings' | 'logs' | 'assets' | 'mail-log' | 'ledger' | 'products' | 'transactions' | 'news'
 * - format: 'csv' | 'json' (default: csv)
 */
export async function GET(request: Request) {
  const payload = await getPayload({ config })
  const { searchParams } = new URL(request.url)

  const book = searchParams.get('book') || 'members'
  const format = searchParams.get('format') || 'csv'

  try {
    let data: any[] = []
    let columns: string[] = []

    // Fetch data based on book type
    switch (book) {
      case 'members': {
        const result = await payload.find({ collection: 'members', limit: 0 }) as { docs: any[] }
        data = result.docs
        columns = ['memberId', 'fullName', 'nik', 'gender', 'phone', 'address', 'occupation', 'membershipStatus', 'joinDate']
        break
      }

      case 'board-members': {
        const result = await payload.find({ collection: 'board-members', limit: 0 }) as { docs: any[] }
        data = result.docs
        columns = ['position', 'periodStart', 'periodEnd', 'status', 'createdAt']
        break
      }

      case 'supervisors': {
        const result = await payload.find({ collection: 'supervisors', limit: 0 }) as { docs: any[] }
        data = result.docs
        columns = ['position', 'periodStart', 'periodEnd', 'status', 'createdAt']
        break
      }

      case 'employees': {
        const result = await payload.find({ collection: 'employees', limit: 0 }) as { docs: any[] }
        data = result.docs
        columns = ['position', 'department', 'joinDate', 'employmentStatus', 'status']
        break
      }

      case 'savings': {
        const result = await payload.find({ collection: 'savings', limit: 0 }) as { docs: any[] }
        data = result.docs
        columns = ['savingId', 'type', 'transactionType', 'amount', 'status', 'method', 'createdAt']
        break
      }

      case 'loans': {
        const result = await payload.find({ collection: 'loans', limit: 0 }) as { docs: any[] }
        data = result.docs
        columns = ['loanId', 'amount', 'interestRate', 'tenor', 'status', 'remainingBalance', 'totalPaid', 'createdAt']
        break
      }

      case 'guest-book': {
        const result = await payload.find({ collection: 'guest-book', limit: 0 }) as { docs: any[] }
        data = result.docs
        columns = ['date', 'guestName', 'title', 'organization', 'purpose', 'followUpActions']
        break
      }

      case 'suggestions': {
        const result = await payload.find({ collection: 'suggestions', limit: 0 }) as { docs: any[] }
        data = result.docs
        columns = ['date', 'category', 'subject', 'submittedBy', 'content', 'status']
        break
      }

      case 'meetings': {
        const result = await payload.find({ collection: 'meetings', limit: 0 }) as { docs: any[] }
        data = result.docs
        columns = ['title', 'meetingType', 'date', 'location', 'chairperson', 'secretary', 'status']
        break
      }

      case 'logs': {
        const result = await payload.find({ collection: 'logs', limit: 0 }) as { docs: any[] }
        data = result.docs
        columns = ['date', 'title', 'category', 'importance', 'description', 'reportedBy']
        break
      }

      case 'assets': {
        const result = await payload.find({ collection: 'assets', limit: 0 }) as { docs: any[] }
        data = result.docs
        columns = ['assetCode', 'name', 'category', 'acquisitionDate', 'acquisitionCost', 'condition']
        break
      }

      case 'mail-log': {
        const result = await payload.find({ collection: 'mail-log', limit: 0 }) as { docs: any[] }
        data = result.docs
        columns = ['date', 'mailType', 'mailNumber', 'senderOrRecipient', 'subject', 'notes']
        break
      }

      case 'ledger': {
        const result = await payload.find({ collection: 'ledger', limit: 0, sort: 'date' }) as { docs: any[] }
        data = result.docs.map((entry: any) => ({
          date: entry.date,
          description: entry.description,
          journalType: entry.journalType,
          debit: entry.entries?.reduce((sum: number, e: any) => sum + (e.debit || 0), 0) || 0,
          credit: entry.entries?.reduce((sum: number, e: any) => sum + (e.credit || 0), 0) || 0,
        }))
        columns = ['date', 'description', 'journalType', 'debit', 'credit']
        break
      }

      case 'products': {
        const result = await payload.find({ collection: 'products', limit: 0 }) as { docs: any[] }
        data = result.docs
        columns = ['productCode', 'name', 'category', 'price', 'stock', 'minStock']
        break
      }

      case 'transactions': {
        const result = await payload.find({ collection: 'transactions', limit: 0 }) as { docs: any[] }
        data = result.docs
        columns = ['transactionId', 'type', 'totalAmount', 'paymentMethod', 'status', 'createdAt']
        break
      }

      case 'news': {
        const result = await payload.find({ collection: 'news', limit: 0 }) as { docs: any[] }
        data = result.docs
        columns = ['title', 'slug', 'category', 'status', 'publishedAt']
        break
      }

      default:
        return NextResponse.json({ error: 'Invalid book type' }, { status: 400 })
    }

    // Format data based on requested format
    if (format === 'json') {
      return NextResponse.json({
        success: true,
        book,
        count: data.length,
        data,
      })
    }

    // CSV format
    const header = columns.join(',')
    const rows = data.map((item: any) => {
      return columns.map((col) => {
        let value = item[col]
        if (value === null || value === undefined) value = ''
        if (typeof value === 'object') value = JSON.stringify(value)
        // Escape quotes and wrap in quotes if contains comma
        value = String(value).replace(/"/g, '""')
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = `"${value}"`
        }
        return value
      }).join(',')
    })

    const csv = [header, ...rows].join('\n')

    // Return as downloadable CSV
    const filename = `16-buku-${book}-${new Date().toISOString().split('T')[0]}.csv`

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Export API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}