# KDMP Seeder Scripts

Kumpulan script untuk seeding data ke database KDMP.

## API Endpoints

### Reset & Seed All (REKOMENDASI)
```
GET /api/seed/reset?confirm=true
```

Seeding lengkap dalam 1 endpoint:
- Clear semua data yang ada
- Seed COA (Chart of Accounts)
- Seed 3 Anggota admin
- Seed 25 Anggota dummy
- Seed Organisasi (Pengurus, Pengawas, Karyawan)
- Seed Simpanan Pokok
- Seed Pinjaman
- Seed 16 Buku Administrasi
- Seed Products/Stok
- Seed Berita

**WAJIB pakai `?confirm=true` untuk konfirmasi delete data!**

### Individual Seeds
```
GET /api/seed/coa          # Seed COA saja
GET /api/seed/9buku       # Seed 9 Buku dasar
GET /api/seed/16buku      # Seed 16 Buku saja
GET /api/seed/dummy       # Seed 25 anggota dummy
GET /api/seed/all         # Seed COA + Anggota
```

## Urutan Seeding yang Benar

```
1. Clear data (anak ke induk)
   ↓
2. Seed COA (akun akuntansi)
   ↓
3. Seed Members (anggota) - banyak tabel depend ke member
   ↓
4. Seed Users (akun login) - depend ke member
   ↓
5. Seed Organization (board-members, supervisors, employees)
   ↓
6. Seed Simpan Pinjam (savings, loans)
   ↓
7. Seed 16 Buku (guest-book, suggestions, meetings, dll)
   ↓
8. Seed Products, News, Notifications
```

## Contoh Penggunaan

### Reset & Seed Semua Data
```bash
curl "http://localhost:3000/api/seed/reset?confirm=true"
```

### Seed Individual
```bash
curl http://localhost:3000/api/seed/coa
curl http://localhost:3000/api/seed/16buku
```

## Respons API

### Sukses
```json
{
  "success": true,
  "message": "Reset & Seed completed successfully",
  "details": {
    "cleared": ["Anggota: 28 dihapus", "Simpanan: 50 dihapus"],
    "seeded": {
      "COA": 13,
      "Anggota (Admin)": 3,
      "Anggota (Dummy)": 25
    }
  }
}
```

### Konfirmasi Diperlukan
```json
{
  "success": false,
  "message": "Konfirmasi diperlukan. Tambahkan ?confirm=true pada URL untuk melanjutkan.",
  "warning": "Ini akan menghapus SEMUA data yang ada!"
}
```

## Keamanan

Di production, seed dinonaktifkan. Aktifkan dengan:
```env
ALLOW_SEED=true
```

## Struktur Folder

```
src/
├── seeder/                    # Data files
│   ├── index.ts
│   ├── coa.ts
│   ├── data-9buku.ts
│   ├── data-16buku.ts
│   └── data-dummy.ts
│
└── app/(app)/api/seed/
    ├── coa/route.ts
    ├── 9buku/route.ts
    ├── 16buku/route.ts
    ├── dummy/route.ts
    ├── all/route.ts
    └── reset/route.ts        # ⭐ Complete reset + seed
```

---

_Dibuat: 2026-04-29 | KDMP Seeder v1.1.0_
