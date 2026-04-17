# Upgrade Plan - KDMP (Koperasi Desa Merah Putih)

> Generated: 2026-04-17
> Prioritas: CRITICAL = 🔴 | HIGH = 🟠 | MEDIUM = 🟡 | LOW = 🟢

---

## 1. ARCHITECTURE ISSUES (🔴 CRITICAL)

### 1.1 COA (Chart of Accounts) Tidak Konsisten
**Problem:** Konstanta COA di `src/constants/chart-of-accounts.ts` TIDAK MATCH dengan seed data di `src/seed/coa.ts`.

| Account | constants/ | seed/ |
|---------|-----------|-------|
| Kas | `1-1001` | `1-1001` ✅ |
| Simpanan Pokok | `3-2001` | `2-1001` ❌ |
| Simpanan Wajib | `3-2002` | `2-1002` ❌ |
| Simpanan Sukarela | `3-2003` | `2-1003` ❌ |

**Impact:** Ledger entries menggunakan kode yang salah → neraca tidak akurat.

**Location:**
- `src/constants/chart-of-accounts.ts:28-30`
- `src/seed/coa.ts:28-30`

**Fix:** Update constants agar match dengan seed data (Simpanan di bawah 2-xxxx = Kewajiban).

---

### 1.2 MemberRegistry vs Members - Data Duplication
**Problem:** Ada 2 collection yang menyimpan data anggota:
- `members` (Buku Induk Anggota - lengkap dengan foto, NIK, dll)
- `member-registry` (Daftar Administratif - nomor buku induk saja)

**Impact:** Redundansi data, potential inconsistency.

**Location:** `src/collections/Members/index.ts`, `src/collections/MemberRegistry/index.ts`

---

### 1.3 Dashboard Component Name Mismatch
**Problem:** File `src/app/(app)/dashboard/page.tsx` EXPORTS `Dashboard` tapi IMPORTS `MemberDashboard` dari file yang sama.

**Location:** `src/app/(app)/dashboard/page.tsx:1-2`

**Code:**
```tsx
import MemberDashboard from './page'  // ❌ Circular import or wrong import
export default Dashboard  // ❌ Exports "Dashboard" but file has no "Dashboard"
```

---

### 1.4 Dashboard Data Field Mismatch
**Problem:** API `/api/stats` response menggunakan `totalSavingsCount` tapi Dashboard expects `totalSavings`.

**Location:**
- API: `src/app/(app)/api/stats/route.ts:60-78`
- Dashboard: `src/app/(app)/dashboard/page.tsx:267-271`

---

## 2. ACCESS CONTROL ISSUES (🔴 CRITICAL)

### 2.1 isSelfOrAdmin Logic Error
**Problem:** Fungsi `isSelfOrAdmin` di `src/access/index.ts:42-51` menggunakan `member: { equals: user.id }` tapi field `member` di Loans/Savings adalah RELATIONSHIP ke collection `members`, bukan ke `users`.

**Code:**
```typescript
export const isSelfOrAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  if (checkRole(['super-admin', 'pengurus', 'staff'], user)) return true
  return {
    member: { equals: user.id }, // ❌ Should be user.id mapped to member.id
  }
}
```

**Impact:** Anggota tidak bisa melihat data pinjaman/simpanan mereka sendiri.

**Fix:** Query member by user relationship first, then use member.id in query.

---

### 2.2 Role Checking Array Method Inconsistent
**Problem:** `checkRole` menggunakan `user.roles?.includes()` tapi di beberapa tempat menggunakan `user.roles?.some()` atau manual iteration.

**Location:** `src/access/checkRole.ts:11-15`

---

### 2.3 Users Collection Admin Access Logic
**Problem:** `admin` access function menggunakan `every()` dengan logic yang complicated.

**Location:** `src/collections/Users/index.ts:30-34`

---

## 3. DATA INTEGRITY ISSUES (🟠 HIGH)

### 3.1 Savings Balance Not Auto-Calculated
**Problem:** Collection `Savings` memiliki field `balance` tapi tidak ada hook yang menghitung saldo secara otomatis dari transaksi sebelumnya.

**Location:** `src/collections/Savings/index.ts`

**Impact:** Field `balance` akan selalu 0 atau stale.

---

### 3.2 Savings Withdrawal Tidak Membuat Ledger Entry
**Problem:** Di `Savings.afterChange`, hanya `status === 'completed'` yang membuat ledger entry. Untuk `withdrawal` transaction, ini akan salah mencatat.

**Code:** `src/collections/Savings/index.ts:37-70`

---

### 3.3 Installment Schedule - JSON Storage
**Problem:** `installmentSchedule` di Loans disimpan sebagai JSON array dalam field. Untuk pinjaman dengan tenor 60 bulan, ini jadi 60 objek per pinjaman.

**Impact:** Tidak bisa query individual installment dengan efficient database index.

**Location:** `src/collections/Loans/index.ts:311-375`

---

### 3.4 Remaining Balance Calculation Inconsistency
**Problem:** Di `Loans.beforeChange` (line 100):
```typescript
data.remainingBalance = (data.amount || 0) * (1 + (data.interestRate || 0) / 100) - totalPaid
```
Ini menghitung total dengan bunga sederhana, tapi tidak mempertimbangkan tenor.

**Location:** `src/collections/Loans/index.ts:100`

---

### 3.5 No Deduction of Savings Balance on POS Purchase
**Problem:** Di `Transactions.afterChange`, ketika `paymentMethod === 'savings-deduction'`, code membuat savings withdrawal record TAPI tidak mengurangi balance savings account secara atomic.

**Location:** `src/collections/Transactions/index.ts:74-92`

---

## 4. API ISSUES (🟠 HIGH)

### 4.1 Balance Sheet - O(n*m) Complexity
**Problem:** Di `balance-sheet/route.ts`, ada nested loop dengan `accounts.docs.find()` di dalam `forEach`.

**Location:** `src/app/(app)/api/reports/balance-sheet/route.ts:38-47`

**Code:**
```typescript
ledgerEntries.docs.forEach((entry: any) => {
  entry.entries.forEach((subEntry: any) => {
    const account = accounts.docs.find((a: any) => a.code === accCode) // ❌ O(n) per entry
  })
})
```

**Impact:** Performance sangat lambat dengan data besar.

---

### 4.2 No Pagination on Stats API
**Problem:** `/api/stats` menggunakan `limit: 0` yang mengambil SEMUA dokumen.

**Location:** `src/app/(app)/api/stats/route.ts:50-57`

---

### 4.3 No Error Typed in API Routes
**Problem:** Semua error catch menggunakan `error: any` tanpa proper error handling.

**Location:** Multiple API routes

---

### 4.4 Auth Header Cast to `any`
**Problem:** Beberapa tempat menggunakan `headers: request.headers as any` untuk Payload auth.

**Location:** `src/app/(app)/api/members/me/route.ts:23`, `src/app/(app)/api/loan-requests/route.ts:24`

---

## 5. ACCOUNTING ISSUES (🟠 HIGH)

### 5.1 Double Entry for Savings Deposit is Wrong
**Problem:** Di `Savings.afterChange`, untuk deposit:
- Debit: Kas (1-1001)
- Credit: Simpanan Pokok/Wajib/Sukarela

Ini BENAR untuk perspective akuntansi (kas bertambah, tapi anggota HAD untuk simpanan mereka).

**Tapi:** Jika anggota menarik simpanan, journal entrinya salah atau tidak ada.

**Location:** `src/collections/Savings/index.ts:42-65`

---

### 5.2 Transactions POS Ledger Entry Uses Hardcoded Account
**Problem:** Di `Transactions.afterChange`, account code hardcoded:
```typescript
const debitAccount = doc.paymentMethod === 'savings-deduction' ? '2-1003' : '1-1001'
```

**Location:** `src/collections/Transactions/index.ts:96`

---

### 5.3 Interest Calculation Simple vs Compound
**Problem:** Di `generateInstallmentSchedule`, menggunakan simple interest. Untuk Cooperatives di Indonesia, biasanya menggunakan flat rate tapi tidak如实记录.

**Location:** `src/collections/Loans/index.ts:8-48`

---

## 6. CODE QUALITY ISSUES (🟡 MEDIUM)

### 6.1 Excessive Use of `any` Type
**Problem:** Banyak tempat menggunakan `any` untuk types.

**Location:** Throughout codebase, especially in:
- `src/app/(app)/api/stats/route.ts`
- `src/app/(app)/dashboard/page.tsx`
- All `afterChange` hooks

---

### 6.2 No Input Validation in Loan Request API
**Problem:** `POST /api/loan-requests` tidak memvalidasi:
- Maksimum pinjaman berdasarkan simpanan
- Rasio utang terhadap income

**Location:** `src/app/(app)/api/loan-requests/route.ts:86-99`

---

### 6.3 Hardcoded Configuration Values
**Problem:** Beberapa nilai hardcoded:
- Interest rate default 12% di `loan-requests/route.ts:108`
- Minimum loan 500,000 di `dashboard/loans/apply/page.tsx:76`

**Location:**
- `src/app/(app)/api/loan-requests/route.ts:108`
- `src/app/(app)/dashboard/loans/apply/page.tsx:76`

---

### 6.4 Inconsistent Date Formats
**Problem:** Beberapa tempat menggunakan `toISOString()`, beberapa menggunakan `toLocaleDateString()`.

---

### 6.5 No Database Indexes Defined
**Problem:** Collection tidak memiliki explicit indexes untuk frequently queried fields seperti:
- `members.membershipStatus`
- `loans.status`
- `savings.status`
- `ledger.date`

---

## 7. MISSING FEATURES (🟡 MEDIUM)

### 7.1 No Audit Trail
**Problem:** Perubahan penting (approval loan, status change) tidak dicatat dengan user + timestamp.

---

### 7.2 No Notification System
**Problem:** Tidak ada notifikasi untuk:
- Loan status change
- Savings withdrawal/deposit confirmation
- Low stock alerts

---

### 7.3 No SHU Calculation Module
**Problem:** SHU di `stats/route.ts` menggunakan estimasi 20%, bukan calculation yang proper.

**Location:** `src/app/(app)/api/stats/route.ts:91-105`

---

### 7.4 No Backup/Restore
**Problem:** Tidak ada mekanisme backup database.

---

### 7.5 No Email/SMS Integration
**Problem:** Tidak ada integration untuk mengirim notifikasi ke anggota.

---

## 8. UI/UX ISSUES (🟢 LOW)

### 8.1 Inline Styles Only
**Problem:** Semua styling menggunakan inline styles, tidak ada CSS modules atau tailwind.

**Impact:** Maintenance sulit, inconsistent styling.

---

### 8.2 No Loading States
**Problem:** Beberapa form tidak memiliki loading state yang jelas.

**Location:** `src/app/(app)/dashboard/loans/apply/page.tsx`

---

### 8.3 No Error Boundaries
**Problem:** React error boundaries tidak digunakan.

---

### 8.4 No Form Validation Feedback
**Problem:** User tidak tahu input mana yang salah.

---

## 9. PERFORMANCE ISSUES (🟢 LOW)

### 9.1 N+1 Query Problem in Dashboard
**Problem:** Dashboard fetch stats, settings secara terpisah. Bisa di-optimize dengan single query.

**Location:** `src/app/(app)/dashboard/page.tsx:257-290`

---

### 9.2 No Caching
**Problem:** Stats dan reports dihitung ulang setiap request.

---

## 10. SECURITY ISSUES (🟠 HIGH)

### 10.1 NIK Access Control
**Problem:** NIK access read dibatasi tapi tidak ada field-level encryption.

**Location:** `src/collections/Members/index.ts:84-86`

---

### 10.2 No Rate Limiting on API
**Problem:** API `/api/loan-requests` tidak ada rate limiting.

---

### 10.3 CORS Origins Configurable via Env
**Problem:** CORS origins dari env variable tapi tidak ada validation.

**Location:** `src/payload.config.ts:146-147`

---

## PRIORITY ACTION ITEMS

### MUST FIX (This Week)
1. **[CRITICAL]** Fix COA constants mismatch - `src/constants/chart-of-accounts.ts`
2. **[CRITICAL]** Fix `isSelfOrAdmin` access logic - `src/access/index.ts`
3. **[CRITICAL]** Fix Dashboard field mismatch - `src/app/(app)/api/stats/route.ts`
4. **[HIGH]** Fix savings withdrawal ledger entries - `src/collections/Savings/index.ts`
5. **[HIGH]** Fix balance sheet O(n*m) query - `src/app/(app)/api/reports/balance-sheet/route.ts`

### SHOULD FIX (This Month)
6. Add database indexes for frequently queried fields
7. Implement proper SHU calculation
8. Add pagination to API endpoints
9. Add input validation for loan requests
10. Fix remaining balance calculation in Loans

### NICE TO HAVE (Next Quarter)
11. Add notification system
12. Add audit trail
13. Add backup/restore functionality
14. Implement CSS styling system (Tailwind or CSS Modules)
15. Add rate limiting to APIs
