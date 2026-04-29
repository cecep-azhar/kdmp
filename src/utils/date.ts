/**
 * Date Utility Functions
 * Standardized date formatting for KDMP application
 */

// Format tanggal Indonesia
export const formatDateID = (date: string | Date | null | undefined): string => {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'

  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

// Format tanggal singkat (dd/MM/yyyy)
export const formatDateShort = (date: string | Date | null | undefined): string => {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'

  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Format tanggal untuk database (ISO)
export const formatDateISO = (date: string | Date | null | undefined): string => {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  return d.toISOString()
}

// Format tanggal untuk ledger/jurnal
export const formatJournalDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'

  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// Format datetime Indonesia
export const formatDateTimeID = (date: string | Date | null | undefined): string => {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'

  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Format waktu saja
export const formatTimeID = (date: string | Date | null | undefined): string => {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'

  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Get relative time (e.g., "2 jam yang lalu")
export const getRelativeTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'

  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'Baru saja'
  if (diffMins < 60) return `${diffMins} menit yang lalu`
  if (diffHours < 24) return `${diffHours} jam yang lalu`
  if (diffDays < 7) return `${diffDays} hari yang lalu`

  return formatDateID(date)
}

// Get start and end of year
export const getYearRange = (year?: number): { start: string; end: string } => {
  const y = year || new Date().getFullYear()
  return {
    start: `${y}-01-01T00:00:00.000Z`,
    end: `${y}-12-31T23:59:59.999Z`,
  }
}

// Get start and end of month
export const getMonthRange = (year?: number, month?: number): { start: string; end: string } => {
  const d = new Date()
  const y = year || d.getFullYear()
  const m = month !== undefined ? month : d.getMonth()

  const start = new Date(y, m, 1)
  const end = new Date(y, m + 1, 0, 23, 59, 59, 999)

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  }
}

// Check if date is overdue
export const isOverdue = (dueDate: string | Date): boolean => {
  const d = new Date(dueDate)
  const now = new Date()
  return d < now
}

// Get days overdue
export const getDaysOverdue = (dueDate: string | Date): number => {
  const d = new Date(dueDate)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
}

// Format currency Indonesia
export const formatCurrency = (amount: number, showDecimal = false): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: showDecimal ? 2 : 0,
    maximumFractionDigits: showDecimal ? 2 : 0,
  }).format(amount)
}

// Format number Indonesia
export const formatNumber = (num: number, decimals = 0): string => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}