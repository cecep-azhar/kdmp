# Refactory Checklist - KDMP (Koperasi Desa Merah Putih)
**Tanggal:** 12 April 2026
**Prioritas:** P0 = Critical, P1 = High, P2 = Medium

---

## 🔴 P0 — Critical (HARUS SEGERA DIPERBAIKI)

### [P0-01] Security: Hardcoded Secret Key
**File:** `src/payload.config.ts:141`
```typescript
secret: process.env.PAYLOAD_SECRET || 'default-secret-change-in-production'
```
**Masalah:** Jika environment variable tidak diset, secret default bisa dipakai oleh attacker
**Fix:** Hapus fallback, gunakan assertion atau error jika tidak ada secret

### [P0-02] Security: Seed API Endpoints Terbuka
**File:** `src/app/(app)/api/init-admin/route.ts`
**Masalah:** Endpoint `/api/init-admin` bisa diakses tanpa autentikasi, reset password admin
**Fix:** Protect dengan check environment variable + admin auth

### [P0-03] Security: Seed Data Endpoints Terbuka
**Files:** `src/app/(app)/api/seed-9buku/route.ts`, `src/app/(app)/api/seed-16buku/route.ts`
**Masalah:** Endpoint seeding bisa inject data tanpa auth
**Fix:** Hapus atau protect dengan env variable check

### [P0-04] Security: CORS Hardcoded
**File:** `src/payload.config.ts:146-147`
```typescript
cors: ['http://localhost:3000', 'http://localhost:3001']
```
**Masalah:** CORS hanya untuk development, production perlu dikonfigurasi
**Fix:** Ambil dari environment variable

### [P0-05] Warna: Default Colors Bukan Merah Putih
**File:** `src/globals/Settings.ts:67`
```typescript
defaultValue: '#4f46e5', // Indigo 600!!! BUKAN merah putih
```
**Fix:** Ganti ke `'#DC2626'` (Red 600)

### [P0-06] Warna: Accent Color Bukan Putih
**File:** `src/globals/Settings.ts:77`
```typescript
defaultValue: '#10b981', // Emerald 500 as default
```
**Fix:** Ganti ke `'#FFFFFF'` atau gold `'#F59E0B'` sebagai accent

---

## 🟡 P1 — High Priority (Perlu Diperbaiki Soon)

### [P1-01] Hardcoded Account Codes
**Files:** `src/collections/Loans/index.ts:121-129`, `src/collections/Savings/index.ts:43-44`
**Masalah:** Kode akun hardcoded ('1-1001', '1-1002', dll) harusnya di-constant
**Fix:** Buat `src/constants/chart-of-accounts.ts`

### [P1-02] Race Condition di ID Generation
**Files:** `src/collections/Loans/index.ts:74-76`, `src/collections/Savings/index.ts:28-31`
```typescript
const count = await req.payload.count({ collection: 'loans' })
const seq = String(count.totalDocs + 1).padStart(6, '0')
```
**Masalah:** 2 request bersamaan bisa menghasilkan ID yang sama
**Fix:** Gunakan database sequence atau timestamp-based ID

### [P1-03] TypeScript: @ts-ignore Used
**File:** `src/app/(app)/api/stats/route.ts:57-60`
**Masalah:** Menggunakan `// @ts-ignore` untuk menghindari type checking
**Fix:** Definisikan interface `ReportData` dengan benar

### [P1-04] TypeScript: `any` Types Berlebihan
**File:** `src/components/admin/Dashboard.tsx:248`
```typescript
const [settings, setSettings] = useState<any>(null)
```
**Fix:** Definisikan interface untuk Settings

### [P1-05] SHU Calculation Pakai Dummy Data
**File:** `src/app/(app)/api/stats/route.ts:51`
```typescript
totalExpenses: Math.round((stats.todayRevenue || 0) * 0.15) + 500000
```
**Masalah:** SHU adalah fitur paling penting, perhitungannya masih asal
**Fix:** Implementasi SHU sesuai UU Kopearsi No. 25/1992

---

## 🟢 P2 — Medium Priority

### [P2-01] Logo Pakai Emoji 🏛️
**Files:** `src/components/admin/Icon.tsx`, `src/components/admin/Dashboard.tsx:331`
**Masalah:** Emoji tidak professional untuk enterprise
**Fix:** Gunakan SVG logo proper

### [P2-02] Dark Mode Primary Color Salah
**File:** `src/globals/Settings.ts:92`
```typescript
defaultValue: '#6366f1', // Indigo 500 as default
```
**Fix:** Ganti ke `'#DC2626'` untuk dark mode juga

### [P2-03] Seed Scripts di Root Directory
**Files:** `create-admin.ts`, `seed-data.ts`, `update-labels.ts`
**Masalah:** File script ada di root, sebaiknya di folder `scripts/`
**Fix:** Pindahkan ke `scripts/` directory

### [P2-04] Error Logging Pakai console.error
**Multiple files:** Loans, Savings, Dashboard
**Masalah:** Tidak ada structured logging untuk production
**Fix:** Gunakan Payload built-in logger atau Pino

---

## ✅ Completed Fixes

| No | Item | Status | Tanggal |
|----|------|--------|---------|
| 01 | Create refactory_120426.md | ✅ Done | 2026-04-17 |
| 02 | Fix payload.config.ts security (secret, cors) | ✅ Done | 2026-04-17 |
| 03 | Fix Settings.ts warna merah putih | ✅ Done | 2026-04-17 |
| 04 | Protect seed API endpoints | ✅ Done | 2026-04-17 |
| 05 | Create chart-of-accounts constants | ✅ Done | 2026-04-17 |
| 06 | Fix type safety (any, @ts-ignore) | ✅ Done | 2026-04-17 |
| 07 | Implement proper SHU calculation | ✅ Done | 2026-04-17 |
| 08 | Fix race condition ID generation | ⏳ Pending | - |
| 09 | Fix build errors (seed scripts, translations) | ✅ Done | 2026-04-17 |
| 10 | Install @payloadcms/translations | ✅ Done | 2026-04-17 |

---

## Catatan Tambahan

Aplikasi KDMP sudah memiliki fondasi yang baik untuk kebutuhan Koperasi Merah Putih di Indonesia:
- 16 buku administrasi koperasi ✅
- Modul simpan pinjam dengan ledger ✅
- Dashboard admin dengan statistik ✅
- Admin panel Payload CMS ✅
- Member app dengan mobile-first design ✅

Yang paling kritis untuk segera diperbaiki adalah **security issues** (P0) sebelum deployment.
