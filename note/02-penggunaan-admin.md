# 02. Penggunaan Aplikasi Admin

## Login Admin

1. Buka `URL/admin`
2. Masukkan email & password
3. Klik **Masuk**

---

## Tampilan Dashboard Admin

```
┌──────────────────────────────────────────────────────┐
│  Logo Coop    [Statistik]  [Notifikasi]  [Profil]   │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │Total    │ │Simpanan │ │Pinjaman │ │ SHU     │   │
│  │Anggota  │ │Hari Ini │ │Aktif    │ │ Estimate│   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
│                                                      │
│  [Aktivitas Terbaru]                                │
│  [Akses Cepat 16 Buku]                             │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Menu Utama Admin

### Simpan Pinjam
| Menu | Fungsi |
|------|--------|
| **Simpanan** | Catat setoran & penarikan anggota |
| **Pinjaman** | Kelola pengajuan & pencairan |
| **Buku Besar** | Lihat semua jurnal transaksi |

### 16 Buku Admin
| Menu | Fungsi |
|------|--------|
| Anggota | Daftar & profil anggota |
| Pengurus | Daftar pengurus cooperativa |
| Pengawas | Daftar pengawas |
| Karyawan | Daftar karyawan |
| Tamu | Buku tamu/anjuran pejabat |
| Kas | Jurnal umum/transaksi harian |
| Aset | Inventaris cooperativa |
| Berita | Pengumuman & info |

---

## Input Simpanan Baru

1. Menu **Simpan Pinjam** → **Simpanan**
2. Klik **Buat Baru** (+)
3. Isi formulir:
   - Pilih **Anggota**
   - Pilih **Jenis**: Pokok / Wajib / Sukarela
   - Pilih **Tipe**: Setor / Tarik
   - Masukkan **Jumlah** (Rp)
   - Pilih **Metode**: Tunai / Transfer
4. Klik **Simpan**

> *Otomatis tercatat di Buku Kas (Ledger)*

---

## Input Pinjaman Baru

1. Menu **Simpan Pinjam** → **Pinjaman**
2. Klik **Buat Baru** (+)
3. Isi formulir:
   - Pilih **Anggota**
   - Masukkan **Jumlah Pinjaman** (Rp)
   - Masukkan **Bunga** (%/tahun)
   - Masukkan **Tenor** (bulan)
   - Pilih **Tujuan**
4. Klik **Simpan**

### Status Pinjaman

| Status | Arti |
|--------|------|
| Menunggu | Belum diproses |
| Disetujui | Sudah disetujui, belum dicairkan |
| Aktif | Sudah dicairkan, sedang mengangsur |
| Lunas | Sudah selesai lunas |
| Ditolak | Pengajuan ditolak |

---

## Kelola Angsuran

1. Buka detail **Pinjaman Aktif**
2. Scroll ke **Jadwal Angsuran**
3. Klik dropdown **Status** pada angsuran yang dibayar
4. Pilih **"Dibayar"**
5. Isi **Tanggal Bayar**
6. Klik **Simpan**

> *Angsuran akan otomatis mengurangi sisa pinjaman & tercatat di kas*

---

## Buat Berita/Pengumuman

1. Menu **Berita**
2. Klik **Buat Baru** (+)
3. Isi:
   - **Judul** berita
   - **Kategori**: Berita / Pengumuman / Edukasi
   - **Konten** (teks/rich text)
   - Aktifkan **Tampilkan** jika siap publish
4. Klik **Simpan**

---

## Tips & Catatan Penting

- **Simpanan Pokok** = setor sekali saat daftar, tidak bisa ditarik
- **Simpanan Wajib** = setor rutin bulanan
- **Simpanan Sukarela** = setor/tarik kapan saja
- **Bunga Pinjaman** dihitung otomatis per bulan
- Setiap transaksi **selalu masuk Ledger** secara otomatis
