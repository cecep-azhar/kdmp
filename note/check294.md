# Check Report KDMP - Bug & Fitur Bermasalah (#294)

> **Tanggal:** 2026-04-29
> **Auditor:** Cecep Saeful Azhar Hidayat, ST
> **Project:** KDMP - Sistem Informasi Kopi Desa Merah Putih

---

## RINGKASAN EKSEKUTIF

| Kategori | Jumlah | Prioritas |
|----------|--------|-----------|
| Bug/Fungsional | 12 items | 🔴 CRITICAL - 3, 🟠 HIGH - 5, 🟡 MEDIUM - 4 |
| Fitur Bermasalah | 10 items | 🔴 CRITICAL - 4, 🟠 HIGH - 3, 🟡 MEDIUM - 3 |

---

## 🔴 BUGS - CRITICAL (Harus Segera Diperbaiki)

### BUG #1: Seed API Routes Tanpa Authentikasi
**Lokasi:** `src/app/(app)/api/seed-*/route.ts`

**Masalah:**
- `/api/init-admin` - endpoint untuk buat admin baru tanpa auth
- `/api/seed-9buku` dan `/api/seed-16buku` - inject data tanpa verifikasi

**Dampak:** Siapa saja bisa membuat admin atau inject data palsu ke database.

**Kode Bermasalah:**
```typescript
// ❌ seed-dummy/route.ts
export const GET = async () => {
  // Tidak ada auth check!
  await req.payload.create({ collection: 'members', data: {...} })
}
```

**Rekomendasi Fix:**
```typescript
// Tambahkan check di awal
if (process.env.NODE_ENV === 'production') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

---

### BUG #2: Simpanan Pokok Bisa Ditarik
**Lokasi:** `src/collections/Savings/index.ts`

**Masalah:** Berdasarkan UU Perkoperasian No. 25 Tahun 1992, Simpanan Pokok **tidak boleh ditarik** selama masih menjadi anggota. Namun aplikasi saat ini mengizinkan semua jenis simpanan untuk di-withdraw.

**Kode Bermasalah (line 40-73):**
```typescript
// ❌ Tidak ada validasi untuk simpanan pokok
if (operation === 'create' && doc.status === 'completed') {
  // Langsung proses, tidak check type === 'pokok'
}
```

**Rekomendasi Fix:**
```typescript
if (doc.transactionType === 'withdrawal' && doc.type === 'pokok') {
  throw new Error('Simpanan Pokok tidak dapat ditarik')
}
```

---

### BUG #3: Validasi Saldo Tidak Ada Saat Withdrawal
**Lokasi:** `src/collections/Savings/index.ts`

**Masalah:** User bisa menarik simpanan lebih dari saldo yang ada.

**Rekomendasi Fix:** Tambahkan hook untuk validasi saldo sebelum withdrawal.

---

## 🟠 BUGS - HIGH PRIORITY

### BUG #4: ID Generation Race Condition
**Lokasi:** Multiple collections (Members, Savings, Loans)

**Masalah:**
```typescript
// ❌ Di Loans/index.ts:99-104
const count = await req.payload.count({ collection: 'loans' })
const seq = String(count.totalDocs + 1).padStart(6, '0')
data.loanId = `PIN-${dateStr}-${seq}`
```

Jika 2 transaksi masuk bersamaan, bisa menghasilkan ID yang sama → conflict unique.

**Rekomendasi Fix:** Gunakan timestamp + random suffix, atau database sequence.

---

### BUG #5: Balance Sheet API - O(n*m) Complexity
**Lokasi:** `src/app/(app)/api/reports/balance-sheet/route.ts:38-47`

**Masalah:**
```typescript
// ❌ Nested loop - sangat lambat dengan data besar
ledgerEntries.docs.forEach((entry) => {
  entry.entries.forEach((subEntry) => {
    const account = accounts.docs.find((a) => a.code === accCode) // O(n) per entry
  })
})
```

**Impact:** Performance lambat, bisa timeout dengan data > 10,000 entries.

**Rekomendasi Fix:** Buat Map dari account codes, gunakan indexed lookup.

---

### BUG #6: Stats API - No Pagination (limit: 0)
**Lokasi:** `src/app/(app)/api/stats/route.ts:57-63`

**Masalah:**
```typescript
// ❌ Ambil SEMUA dokumen - berbahaya untuk data besar
payload.find({ collection: 'members', limit: 0 })
```

**Impact:** Memory exhaustion dengan 100,000+ anggota.

**Rekomendasi Fix:** Gunakan aggregate queries atau batasi limit dengan pagination.

---

### BUG #7: Dashboard Field Mismatch
**Lokasi:**
- API: `src/app/(app)/api/stats/route.ts:71-91`
- Dashboard: `src/app/(app)/dashboard/page.tsx:267-271`

**Masalah:** Stats API return `totalSavingsAmount` dan `totalSavingsTransactions`, tapi dashboard mungkin expect field berbeda.

**Status:** Perlu dicek apakah sudah diperbaiki.

---

### BUG #8: Savings Withdrawal Tidak Buat Ledger Entry
**Lokasi:** `src/collections/Savings/index.ts:40`

**Masalah:**
```typescript
// ❌ Hanya buat ledger saat CREATE
if (operation === 'create' && doc.status === 'completed') {
  // Tidak handle status change dari pending -> completed untuk withdrawal
}
```

Ledger entry hanya dibuat untuk deposit, tidak untuk withdrawal yang statusnya berubah.

**Rekomendasi Fix:** Handle `update` operation juga, check previous status.

---

## 🟡 BUGS - MEDIUM PRIORITY

### BUG #9: Excessive Use of `any` Type
**Lokasi:** Throughout codebase

**Contoh:**
```typescript
// stats/route.ts:108-110
// @ts-ignore
reports.totalRevenue = (reports.totalInterest || 0) + (reports.totalSales || 0)
```

**Rekomendasi:** Definisikan interface yang proper, hapus `any` dan `// @ts-ignore`.

---

### BUG #10: CORS Hardcoded Values
**Lokasi:** `src/payload.config.ts:146-147`

**Masalah:**
```typescript
cors: ['http://localhost:3000', 'http://localhost:3001'],  // Hardcoded!
```

**Rekomendasi:** Ambil dari environment variables.

---

### BUG #11: Hardcoded Configuration Values
**Lokasi:**
- `src/app/(app)/api/loan-requests/route.ts:108` - interest rate 12%
- `src/app/(app)/dashboard/loans/apply/page.tsx:76` - minimum loan 500,000

**Rekomendasi:** Simpan di Settings/globals atau environment variables.

---

### BUG #12: Inconsistent Date Formats
**Masalah:** Beberapa tempat pakai `toISOString()`, beberapa pakai `toLocaleDateString()`.

**Rekomendasi:** Buat utility function untuk format tanggal yang konsisten.

---

## 🔴 FITUR BERMASALAH - CRITICAL

### FITUR #1: SHU Calculation Masih Dummy
**Lokasi:** `src/app/(app)/api/stats/route.ts:104-117`

**Masalah:**
```typescript
// ❌ SHU dihitung dengan dummy formula
const estimatedExpenses = Math.round(totalRevenue * 0.20) // 20% hardcoded!
const shu = totalRevenue - estimatedExpenses
```

SHU (Sisa Hasil Usaha) adalah fitur paling penting dikoprasi. Saat ini menggunakan estimasi, bukan perhitungan yang proper sesuai UU.

**Yang Seharusnya:**
- Pendapatan bunga dari setiap angsuran (sudah ada)
- Pendapatan toko (sudah ada)
- Beban operasional riil (belum ada)
- Alokasi: Cadangan 20%, Jasa Modal 50%, Jasa Anggota 50%

**Rekomendasi:** Implementasikan SHU calculation yang lengkap.

---

### FITUR #2: Laporan Keuangan Belum Lengkap
**Status:** Belum ada laporan wajib koprasi:
- ❌ Neraca (Balance Sheet)
- ❌ Laporan Laba Rugi (Income Statement)
- ❌ Laporan Arus Kas (Cash Flow)
- ❌ Laporan Perubahan Ekuitas
- ❌ Laporan SHU per Anggota

**Rekomendasi:** Buat halaman `/admin/reports` dengan export PDF/Excel.

---

### FITUR #3: Warna UI Belum Merah Putih
**Lokasi:** Multiple files

**Masalah:**
```typescript
// ❌ Settings.ts:67-68
defaultValue: '#4f46e5', // Indigo, BUKAN merah putih!

// ❌ MemberDashboard.tsx
background: 'linear-gradient(135deg, #4f46e5, #6366f1)' // Indigo!
```

KOPERASI Desil Merah Putih seharusnya menggunakan warna **Merah (#DC2626)** dan **Putih**.

**Yang Benar (dari Landing Page):**
```typescript
// ✅ src/app/(app)/page.tsx sudah menggunakan merah
background: 'linear-gradient(135deg, #DC2626, #EF4444)'
```

**Rekomendasi:** Update Settings default dan member app untuk pakai warna merah putih.

---

### FITUR #4: Logo Masih Emoji, Bukan SVG Proper
**Lokasi:** `src/components/admin/Icon.tsx`, `src/components/admin/Logo.tsx`

**Masalah:**
```typescript
// ❌ Menggunakan emoji yang render berbeda di tiap OS/browser
<span className="text-3xl">🏛️</span>
```

**Rekomendasi:**
1. Desain logo SVG proper
2. Simpan di `public/logo.svg`
3. Implementasikan di kedua app
4. Buat favicon custom

---

## 🟠 FITUR BERMASALAH - HIGH PRIORITY

### FITUR #5: Tidak Ada Notification System
**Masalah:** Bell icon di member app tidak fungsional.

**Rekomendasi:** Implementasikan notifikasi untuk:
- Status perubahan pinjaman
- Konfirmasi setoran/penarikan
- Pengumuman dari admin
- Stok barang rendah

---

### FITUR #6: Tidak Ada Audit Trail
**Masalah:** Perubahan penting tidak dicatat dengan user + timestamp.

**Rekomendasi:** Tambah field `deletedAt` untuk soft delete, log perubahan kritis.

---

### FITUR #7: Tidak Ada Sistem Approval Workflow
**Masalah:** Pinjaman tidak ada notifikasi ke pengurus saat ada pengajuan, tidak ada multi-level approval.

**Rekomendasi:** Implementasikan state machine untuk workflow approval.

---

### FITUR #8: Tidak Ada Denda Keterlambatan Angsuran
**Masalah:** Jadwal angsuran sudah ada status `overdue`, tapi tidak ada perhitungan denda.

**Rekomendasi:** Tambahkan penalty calculation otomatis.

---

### FITUR #9: Tidak Ada Export/Print untuk 16 Buku
**Masalah:** Buku fisik masih diwajibkan di banyak koprasi.

**Rekomendasi:** Tambah fitur export PDF/Excel untuk setiap buku.

---

### FITUR #10: Root Layout sebagai Client Component
**Lokasi:** Member app layout

**Masalah:** Root layout menggunakan `"use client"` → seluruh aplikasi client-rendered, tidak ada SSR/SSG.

**Rekomendasi:** Pisahkan provider ke wrapper component.

---

## 📋 PRIORITAS PERBAIKAN

### MUST FIX (Minggu Ini):
1. [CRITICAL] Protect seed API routes
2. [CRITICAL] Cegah penarikan simpanan pokok
3. [CRITICAL] Validasi saldo saat withdrawal
4. [CRITICAL] Fix SHU calculation
5. [HIGH] Fix race condition ID generation

### SHOULD FIX (Bulan Ini):
6. [HIGH] Implementasi Balance Sheet yang proper
7. [HIGH] Pagination pada stats API
8. [HIGH] Update warna ke merah putih
9. [HIGH] Buat logo SVG
10. [MEDIUM] Hapus semua `any` types
11. [MEDIUM] Add notification system

### NICE TO HAVE (Kuartal Ini):
12. [MEDIUM] Export PDF untuk 16 buku
13. [MEDIUM] Audit trail system
14. [MEDIUM] Denda keterlambatan angsuran
15. [LOW] Rate limiting on API
16. [LOW] Soft delete implementation

---

## 📊 METRIK KODE

| Metrik | Nilai | Catatan |
|--------|-------|---------|
| Lines of Code | ~10,000 | Estimasi |
| Collections | 20 | Sudah lengkap |
| API Routes | 15+ | Perlu audit |
| Components | 8 | Admin + shared |
| Bugs Found | 12 | - |
| Fitur Bermasalah | 10 | - |

---

## ✅ PROGRES PERBAIKAN

| Item | Status | Catatan |
|------|--------|---------|
| upgrade_plan.md exists | ✅ | Dokumentasi sudah ada |
| implementation_refactory.md exists | ✅ | Analisis lengkap |
| fix-errors route exists | ✅ | Route untuk cleanup |
| cleanup route exists | ✅ | Route cleanup |

---

_Laporan ini dibuat pada 2026-04-29 untuk referensi dan tracking perbaikan._