# 01. Pengenalan Aplikasi & Infrastruktur

## Apa Itu KDMP?

**KDMP (Koperasi Desa Merah Putih)** adalah sistem informasi digital untuk mengelola operasional cooperativa secara modern dan transparan.

---

## Dua Aplikasi, Satu Sistem

### 1. Aplikasi Admin
- **Fungsi:** Ruang kerja pengurus untuk mengelola seluruh data cooperativa
- **Pengguna:** Pengurus, Pengawas, Staff, Kasir
- **Akses:** `URL/admin`

### 2. Aplikasi Member
- **Fungsi:** Portal mandiri bagi anggota melihat data sendiri
- **Pengguna:** Seluruh anggota cooperativa
- **Akses:** `URL` (halaman utama)

---

## Infrastruktur Sistem

```
┌─────────────────────────────────────────┐
│           BROWSER PENGGUNA              │
├─────────────────┬───────────────────────┤
│   Aplikasi      │    Aplikasi           │
│   Admin         │    Member             │
│   (Payload CMS) │    (Next.js)          │
├─────────────────┴───────────────────────┤
│           Payload CMS API               │
│      (GraphQL + REST API)              │
├─────────────────────────────────────────┤
│           DATABASE                      │
│        PostgreSQL                       │
└─────────────────────────────────────────┘
```

---

## Fitur Utama Sistem

| Modul | Fungsi |
|-------|--------|
| **Simpan Pinjam** | Kelola simpanan pokok, wajib, sukarela & pinjaman |
| **16 Buku Admin** | Daftar anggota, pengurus, karyawan, tamu, kas, dll |
| **Jurnal Otomatis** | Setiap transaksi langsung masuk buku besar |
| **Point of Sale** | Kasir untuk toko/perseverasi cooperativa |
| **Laporan SHU** | Perhitungan bagi hasil anggota |

---

## Keamanan Akses

**Role-Based Access Control (RBAC):**

| Peran | Akses |
|-------|-------|
| Super Admin | Semua fitur & data |
| Pengurus | Kelola operasional & approve |
| Pengawas | Monitoring & audit |
| Staff/Kasir | Input transaksi harian |
| Anggota | Lihat data sendiri |

---

## Teknologi yang Digunakan

| Komponen | Teknologi |
|----------|-----------|
| Frontend | Next.js 15 (React) |
| CMS/Backend | Payload CMS 3.x |
| Database | PostgreSQL |
| Bahasa | TypeScript |
| Penyimpanan | S3 (gambar/dokumen) |

---

## Manfaat bagi Cooperativa

- **Efisien** - Proses pembukuan lebih cepat
- **Transparan** - Anggota bisa cek data sendiri
- **Akurat** - Mengurangi kesalahan hitung manual
- **Terintegrasi** - Satu database untuk semua kebutuhan
