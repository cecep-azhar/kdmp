# KDMP - Beautiful.ai Presentation Script
## Format Copy-Paste Ready untuk Beautiful.ai Slides

---

## SLIDE 1: Cover/Title Slide

**TITLE:**
```
Sistem Informasi
Koperasi Desa Merah Putih
```

**SUBTITLE:**
```
Solusi Digital untuk
Koperasi Modern & Transparan
```

**PRESENTER NOTES:**
```
Selamat datang! Hari ini kita akan memperkenalkan Sistem Informasi 
Koperasi Desa Merah Putih (KDMP) - solusi digital untuk mengelola 
operasional cooperativa secara modern, efisien, dan transparan.
```

---

## SLIDE 2: Latar Belakang

**TITLE:**
```
Mengapa KDMP Hadir?
```

**CONTENT (2 columns):


**LEFT COLUMN - "Tantangan Lama":**
- Pencatatan manual yang rawan kesalahan
- Anggota sulit akses data sendiri
- Laporan membutuhkan waktu berhari-hari
- Transparansi yang rendah

**RIGHT COLUMN - "Solusi KDMP":**
- Otomasi seluruh proses pembukuan
- Akses real-time 24/7
- Laporan instan siap pakai
- Full transparency untuk anggota

**PRESENTER NOTES:**
```
Sebelum sistem digital, cooperativas menghadapi banyak tantangan. 
Pencatatan manual rentan salah, anggota harus datang ke kantor untuk 
cek saldo, dan penyusunan laporan memakan waktu lama. KDMP hadir 
untuk menyelesaikan semua masalah ini.
```

---

## SLIDE 3: Arsitektur Sistem

**TITLE:**
```
Dua Aplikasi, Satu Database
```

**CONTENT (diagram/visual):**

```
┌──────────────────┐     ┌──────────────────┐
│                  │     │                  │
│   APLIKASI       │     │   APLIKASI      │
│   ADMIN          │◀───▶│   MEMBER        │
│                  │     │                  │
│   Payload CMS    │     │   Next.js       │
│                  │     │                  │
│   • Kelola data  │     │   • Lihat data  │
│   • Approve      │     │   • Ajukan      │
│   • Laporan      │     │   • Monitor     │
│                  │     │                  │
└────────┬─────────┘     └────────┬─────────┘
         │                          │
         └──────────┬───────────────┘
                    │
                    ▼
           ┌─────────────────┐
           │                 │
           │   DATABASE      │
           │   PostgreSQL    │
           │                 │
           │   • Members     │
           │   • Savings     │
           │   • Loans       │
           │   • Ledger      │
           │                 │
           └─────────────────┘
```

**PRESENTER NOTES:**
```
Sistem KDMP terdiri dari dua aplikasi yang terhubung ke satu database. 
Aplikasi Admin untuk petugas mengelola data, Aplikasi Member untuk 
anggota mengakses informasi mereka sendiri. Semua data tersimpan 
terpusat sehingga tidak ada duplikasi atau ketidaksesuaian data.
```

---

## SLIDE 4: Fitur Utama Admin

**TITLE:**
```
Kelola Semua dari Satu Dashboard
```

**CONTENT (grid 2x3):**

| **Simpan Pinjam** | **16 Buku Admin** | **Jurnal Otomatis** |
|-------------------|-------------------|---------------------|
| Setor/tarik | Daftar anggota | Setiap transaksi |
| Pinjaman | Pengurus | langsung masuk |
| Angsuran | Kas | buku besar |

| **Laporan SHU** | **Point of Sale** | **Notifikasi** |
|-----------------|-------------------|----------------|
| Hitung bagi | Kelola toko | Alerts untuk |
| hasil otomatis | cooperativa | angsuran jatuh |

**PRESENTER NOTES:**
```
Dashboard admin memberikan akses ke semua fitur utama: pengelolaan 
simpanan dan pinjaman, 16 buku administrasi yang wajib, jurnal yang 
terposting otomatis, perhitungan SHU, kasir toko, dan sistem notifikasi.
```

---

## SLIDE 5: Fitur Utama Member

**TITLE:**
```
Kemudahan untuk Anggota
```

**CONTENT (list with icons):**

| 🏠 | **Dashboard Personal** |
|----|------------------------|
| | Selalu tahu saldo & status |

| 📊 | **Riwayat Transaksi** |
|----|------------------------|
| | Setoran, penarikan, angsuran |

| 💳 | **Ajukan Pinjaman** |
|----|----------------------|
| | Kalkulasi otomatis |

| 📰 | **Berita & Info** |
|----|-------------------|
| | Pengumuman terkini |

| 💬 | **Kritik & Saran** |
|----|---------------------|
| | Komunikasi langsung |

**PRESENTER NOTES:**
```
Aplikasi member memberikan kemandirian bagi anggota. Mereka bisa 
melihat saldo kapan saja, mengajukan pinjaman dengan simulasi 
angsuran, membaca berita cooperativa, dan mengirim kritik saran 
tanpa harus datang ke kantor.
```

---

## SLIDE 6: Alur Setup Master Data

**TITLE:**
```
Mulai dalam 5 Langkah
```

**CONTENT (timeline/process):**

```
[1]                    [2]                    [3]
Buat Akun             Setup Chart           Input Data
Admin                  of Accounts           Anggota
   │                      │                    │
   ▼                      ▼                    ▼
┌───────┐            ┌───────┐            ┌───────┐
│ Login │            │  9    │            │ Bulk  │
│ first │            │ Akun  │            │ Import│
│ admin │            │ Dasar │            │ atau  │
└───────┘            └───────┘            │ satu  │
                                          └───────┘
                                                │
[5]                                              ▼
Setup                                           [4]
Produk &                                        Input
Aset                                            Simpanan
   │                                            Pokok &
   ▼                                            Wajib
┌───────┐                                    ┌───────┐
│ Ready │                                    │Auto   │
│ to    │                                    │Generate│
│ Use   │                                    │ID     │
└───────┘                                    └───────┘
```

**PRESENTER NOTES:**
```
Setup awal sangat mudah. Pertama buat akun admin utama, lalu setup 
chart of accounts default yang sudah kami siapkan. Input anggota 
bisa satu-satu atau import Excel. Terakhir, input produk dan aset. 
Setelah ini, sistem sudah siap digunakan.
```

---

## SLIDE 7: Alur Transaksi Simpanan

**TITLE:**
```
Proses Simpanan - 3 Menit Selesai
```

**CONTENT (process flow):**

```
    ┌─────────────────┐
    │  Pilih Anggota  │
    │  (Search/Scan)  │
    └────────┬────────┘
             │
             ▼
┌─────────────────────────┐
│                         │
│   Pilih Jenis:          │
│   ○ Simpanan Pokok      │
│   ○ Simpanan Wajib      │
│   ○ Simpanan Sukarela   │
│                         │
└────────────┬────────────┘
             │
             ▼
    ┌─────────────────┐
    │ Masukkan Jumlah │
    │ & Metode Bayar  │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │   ✓ TERKONFIRMASI │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────────────────┐
    │      OTOMATIS TERJADI:       │
    │                               │
    │  ✓ ID Transaksi di-generate   │
    │  ✓ Saldo anggota di-update    │
    │  ✓ Posting ke Ledger/Journal │
    │                               │
    │  📄 Bukti transaksi siap     │
    │     untuk anggota            │
    └─────────────────────────────┘
```

**PRESENTER NOTES:**
```
Transaksi simpanan sangat cepat. Petugas tinggal pilih anggota, 
pilih jenis simpanan, masukkan jumlah. Sistem otomatis generate 
ID, update saldo, dan posting ke jurnal. Anggota langsung dapat 
bukti transaksi.
```

---

## SLIDE 8: Alur Pinjaman

**TITLE:**
```
Pinjaman - Dari Ajuan hingga Lunas
```

**CONTENT (cycle diagram):**

```
              ┌──────────────────┐
              │                  │
              │  1. PENGAJUAN   │
              │                  │
              │  Anggota ajukan  │
              │  via app/ admin  │
              │                  │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │                  │
              │  2. REVIEW       │
              │                  │
              │  Admin cek       │
              │  kelayakan       │
              │                  │
              └────────┬─────────┘
                       │
              ┌────────┴────────┐
              │                   │
      [Ditolak]              [Disetujui]
              │                   │
              ▼                   ▼
      ┌──────────┐      ┌──────────────────┐
      │ Alasan   │      │ 3. PENCAIRAN     │
      │ penolakan│      │                  │
      │ dicatat  │      │ Dana masuk kas   │
      └──────────┘      │ Angsuran dibuat  │
                        │                  │
                        └────────┬─────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │                  │
                        │ 4. CICILAN       │
                        │                  │
                        │ Bayar tiap bulan │
                        │ Automatic posting│
                        │                  │
                        └────────┬─────────┘
                                 │
                        ┌────────┴────────┐
                        │                  │
              [Belum Lunas]        [Lunas]
                        │                  │
                        ▼                  ▼
              ┌──────────────────┐  ┌──────────┐
              │ Sisa berkurang    │  │ SHU      │
              │ Next angsuran     │  │ dihitung │
              └──────────────────┘  └──────────┘
```

**PRESENTER NOTES:**
```
Alur pinjaman lengkap dari pengajuan sampai lunas. Anggota bisa 
ajukan via aplikasi, admin review kelayakan, setelah disetujui 
dicairkan dan jadwal angsuran langsung dibuat otomatis. Setiap 
pembayaran angsuran langsung posting ke jurnal. Saat lunas, 
sistem otomatis update status.
```

---

## SLIDE 9: Jurnal Otomatis

**TITLE:**
```
Setiap Transaksi = 1 Jurnal Entry
```

**CONTENT (examples):**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  TRANSAKSI              →     JOURNAL ENTRY               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SETORAN SIMPANAN                                           │
│  ─────────────────                                           │
│                                                             │
│  Kas masuk Rp 500.000         Kas          │    500.000    │
│                                     Simpanan │              │
│                                     Wajib   │    500.000    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PENCAIRAN PINJAMAN                                         │
│  ────────────────────                                       │
│                                                             │
│  Pinjam Rp 10.000.000         Piutang    │  10.000.000    │
│  dicairkan                    Pinjaman    │              │
│                                     Kas     │  10.000.000    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  BAYAR ANGSURAN                                             │
│  ────────────────                                           │
│                                                             │
│  Angsuran Rp 500.000          Kas       │    500.000      │
│  (Pokok 400 + Bunga 100)     Piutang   │    400.000      │
│                                     Pendapatan│              │
│                                     Bunga    │    100.000    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

📊 HASIL: Buku Kas selalu akurat, siap untuk laporan keuangan
```

**PRESENTER NOTES:**
```
Ini adalah fitur kunci KDMP. Setiap transaksi - setoran, penarikan, 
pinjaman, angsuran - otomatis membuat jurnal entry. Ini berarti 
Buku Kas selalu akurat tanpa input manual. Laporan keuangan 
bisa dihasilkan kapan saja dengan data yang reliable.
```

---

## SLIDE 10: Perhitungan SHU

**TITLE:**
```
Hitung SHU dalam Sekejap
```

**CONTENT (formula/steps):**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  SHU KOTOR = Total Pendapatan - Total Beban                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │   PENDAPATAN                    Rp 150.000.000      │   │
│  │   ├─ Bunga Pinjaman             Rp 100.000.000      │   │
│  │   ├─ Penjualan Toko             Rp  45.000.000      │   │
│  │   └─ Lainnya                     Rp   5.000.000      │   │
│  │                                                       │   │
│  │   BEBAN                        Rp  50.000.000      │   │
│  │   ├─ Gaji & Operasional         Rp  40.000.000      │   │
│  │   └─ Lainnya                     Rp  10.000.000      │   │
│  │   ═══════════════════════════════════════════════   │   │
│  │   SHU KOTOR                     Rp 100.000.000      │   │
│  │                                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ALOKASI SHU                                                │
│  ═════════════                                               │
│                                                             │
│  ┌────────────────────┐    ┌────────────────────┐         │
│  │  CADANGAN          │    │  BAGIAN ANGGOTA    │         │
│  │  Minimal 20%       │    │  Maksimal 80%       │         │
│  │                    │    │                    │         │
│  │  Rp 20.000.000    │    │  Rp 80.000.000    │         │
│  └────────────────────┘    └────────────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**PRESENTER NOTES:**
```
Perhitungan SHU yang biasanya memakan waktu berminggu-minggu 
sekarang bisa dilakukan instan. Sistem sudah menghitung otomatis 
berdasarkan semua transaksi tahun berjalan. Tinggal allocate 
sesuai ketentuan: minimal 20% untuk cadangan, sisanya untuk 
anggota.
```

---

## SLIDE 11: Distribusi SHU per Anggota

**TITLE:**
```
Adil & Transparan
```

**CONTENT (split calculation):**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  SHU BAGIAN ANGGOTA = Rp 80.000.000                        │
│                                                             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │  JASA MODAL (50%)      │  │  JASA ANGGOTA (50%)    │  │
│  │                         │  │                         │  │
│  │  Based on:              │  │  Based on:              │  │
│  │  Total Simpanan         │  │  Total Transaksi       │  │
│  │                         │  │  Simpanan + Pinjaman    │  │
│  │  Rumus:                │  │                         │  │
│  │  (Simpanan A / Total)  │  │  Rumus:                │  │
│  │  × 50% × SHU           │  │  (Transaksi A / Total) │  │
│  │                         │  │  × 50% × SHU           │  │
│  │  = SHU Modal           │  │  = SHU Transaksi       │  │
│  └─────────────────────────┘  └─────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  CONTOH: ANGGOTA "BUDI"                            │   │
│  │                                                     │   │
│  │  Simpanan Budi: Rp 10.000.000                     │   │
│  │  Total Simpanan: Rp 500.000.000                   │   │
│  │                                                     │   │
│  │  SHU Modal = (10jt / 500jt) × 40jt = Rp 800.000   │   │
│  │                                                     │   │
│  │  ──────────────────────────────────────────────    │   │
│  │                                                     │   │
│  │  TOTAL SHU BUDI = Rp 800.000 + [SHU Transaksi]    │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**PRESENTER NOTES:**
```
Distribusi SHU menggunakan dua metrik: jasa modal berdasarkan 
simpanan dan jasa anggota berdasarkan transaksi. Ini sesuai 
dengan aturan cooperativas. Perhitungan otomatis per anggota, 
tinggal export untuk RAT.
```

---

## SLIDE 12: 16 Buku - Terpenuhi Otomatis

**TITLE:**
```
16 Buku Administrasi Cooperativa
```

**CONTENT (grid - checkmarks):**

```
┌───────────────────────┬──────────┐  ┌───────────────────────┬──────────┐
│ 1. Daftar Anggota    │    ✓     │  │ 9. Inventaris/Aset   │    ✓     │
├───────────────────────┼──────────┤  ├───────────────────────┼──────────┤
│ 2. Daftar Pengurus    │    ✓     │  │ 10. Ekspedisi/Surat   │    ✓     │
├───────────────────────┼──────────┤  ├───────────────────────┼──────────┤
│ 3. Daftar Pengawas    │    ✓     │  │ 11. Keputusan Rapat   │    ✓     │
├───────────────────────┼──────────┤  ├───────────────────────┼──────────┤
│ 4. Daftar Karyawan    │    ✓     │  │ 12. Kejadian Penting  │    ✓     │
├───────────────────────┼──────────┤  ├───────────────────────┼──────────┤
│ 5. Buku Tamu          │    ✓     │  │ 13. Buku Saran        │    ✓     │
├───────────────────────┼──────────┤  ├───────────────────────┼──────────┤
│ 6. Simpanan Anggota   │    ✓     │  │ 14. Toko/POS          │    ✓     │
├───────────────────────┼──────────┤  ├───────────────────────┼──────────┤
│ 7. Pinjaman Anggota   │    ✓     │  │ 15. Berita/Info       │    ✓     │
├───────────────────────┼──────────┤  ├───────────────────────┼──────────┤
│ 8. Buku Kas/Journal   │    ✓     │  │ 16. SHU               │    ✓     │
└───────────────────────┴──────────┘  └───────────────────────┴──────────┘

         ✅ Semua 16 buku tersedia dan terintegrasi
         ✅ Tidak perlu input manual berlebihan
         ✅ Siap untuk audit kapan saja
```

**PRESENTER NOTES:**
```
KDMP memenuhi seluruh 16 buku administrasi yang diwajibkan 
untuk cooperatives Indonesia. Tidak hanya tersedia, semua buku 
saling terintegrasi. Input di satu tempat langsung reflect 
di buku terkait. Siap untuk audit kapan saja.
```

---

## SLIDE 13: Keamanan & Akses

**TITLE:**
```
Siapa Bisa Melihat Apa?
```

**CONTENT (hierarchy diagram):**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    ROLE-BASED ACCESS                        │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                     │   │
│   │  👑 SUPER ADMIN                                    │   │
│   │     │ Full access - semua fitur & data            │   │
│   │     │                                              │   │
│   │     ├─── 🏛️ PENGURUS                               │   │
│   │     │      │ Kelola operasional, approve          │   │
│   │     │      │                                      │   │
│   │     │      ├─── 👁️ PENGAWAS                       │   │
│   │     │      │       │ Monitoring & audit          │   │
│   │     │      │       │                             │   │
│   │     │      │       ├─── 👤 STAFF / KASIR         │   │
│   │     │      │       │        │ Input transaksi    │   │
│   │     │      │       │        │                    │   │
│   │     │      │       │        └─── 👤 ANGGOTA       │   │
│   │     │      │       │                 │ Lihat data  │   │
│   │     │      │       │                 │ sendiri     │   │
│   │     │      │       │                 │            │   │
│   └─────┴──────┴───────┴─────────────────┴────────────┘   │
│                                                             │
│   🔒 Setiap role melihat data sesuai wewenangnya           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**PRESENTER NOTES:**
```
Sistem keamanan menggunakan Role-Based Access Control. Super Admin 
bisa akses semuanya. Pengurus bisa approve dan manage operasional. 
Pengawas bisa monitoring. Staff input transaksi. Anggota hanya 
bisa melihat dan mengelola datanya sendiri. Tidak ada data yang 
bisa diakses di luar wewenang.
```

---

## SLIDE 14: Teknologi

**TITLE:**
```
Built on Modern Stack
```

**CONTENT (tech stack):**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   FRONTEND                                                  │
│   ┌─────────────────┐                                      │
│   │                 │     BACKEND                          │
│   │   Next.js 15    │◀────┐                               │
│   │   React         │     │                               │
│   │                 │     │     ┌─────────────────┐        │
│   └─────────────────┘     └────▶│                 │        │
│                                 │   Payload CMS    │        │
│   MOBILE-FRIENDLY              │   3.x           │        │
│   ┌─────────────────┐            │                 │        │
│   │                 │     ┌─────▶│   GraphQL API   │        │
│   │   Responsive    │     │      │                 │        │
│   │   Design        │     │      └─────────────────┘        │
│   │                 │     │                               │
│   └─────────────────┘     │                               │
│                           │      ┌─────────────────┐        │
│                           └─────▶│                 │        │
│                                  │   PostgreSQL    │        │
│                                  │                 │        │
│                                  └─────────────────┘        │
│                                                             │
│   CLOUD READY                                               │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│   │   S3     │  │  Deploy  │  │  CDN     │                │
│   │ Storage  │  │  Anywhere│  │  Ready  │                │
│   └──────────┘  └──────────┘  └──────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**PRESENTER NOTES:**
```
KDMP dibangun dengan teknologi modern dan scalable. Frontend pakai 
Next.js React yang cepat dan SEO-friendly. Backend pakai Payload 
CMS yang flexible. Database PostgreSQL yang enterprise-grade. 
Cloud-ready - bisa deploy di mana saja, storage S3, CDN support.
```

---

## SLIDE 15: Ringkasan Benefit

**TITLE:**
```
Benefits in Numbers
```

**CONTENT (big stats):**

```
┌───────────────┬───────────────┬───────────────┬───────────────┐
│               │               │               │               │
│     ⏱️        │      📊      │      💰       │      ✨       │
│               │               │               │               │
│    WAKTU      │   TRANSPARAN  │   EFISIENSI   │   AKURAT     │
│               │               │               │               │
│   Proses      │   Anggota     │   Hemat        │   Zero Error  │
│   90%更快     │   Cek Data    │   Biaya        │   di Hitung   │
│               │   Sendiri     │   Operasional  │               │
│               │               │               │               │
│               │               │               │               │
└───────────────┴───────────────┴───────────────┴───────────────┘

         ╔═══════════════════════════════════════════════╗
         ║                                                   ║
         ║   📱 Akses 24/7 dari Mana Saja               ║
         ║   🔐 Data Aman dengan Role-Based Access        ║
         ║   📋 16 Buku Adm. Siap Audit                  ║
         ║   📈 Laporan SHU Instan untuk RAT              ║
         ║                                                   ║
         ╚═══════════════════════════════════════════════╝
```

**PRESENTER NOTES:**
```
Mari kita rangkum benefits KDMP. Waktu proses 90% lebih cepat. 
Transparansi penuh - anggota bisa cek sendiri. Efisiensi biaya 
operasional. Dan yang paling penting - akurasi perhitungan 
yang tidak bisa dijamin dengan sistem manual.
```

---

## SLIDE 16: Next Steps

**TITLE:**
```
Mulai Perjalanan Digital Anda
```

**CONTENT (CTA + timeline):**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              🚀 SEKEDAR MULAI                              │
│                                                             │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│   │              │  │              │  │              │     │
│   │    MINGGU   │  │    MINGGU   │  │    MINGGU   │     │
│   │      1       │  │      2       │  │      3       │     │
│   │              │  │              │  │              │     │
│   │ Setup Server │  │ Setup Data   │  │ Go Live!     │     │
│   │ & Install    │  │ Master       │  │ Training     │     │
│   │              │  │              │  │ User         │     │
│   └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│                                                             │
│   📞 HUBUNGI KAMI                                          │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                     │   │
│   │   Tim kami siap membantu setup dan implementasi     │   │
│   │   sesuai kebutuhan cooperativa Anda                 │   │
│   │                                                     │   │
│   │   [WhatsApp]  [Email]  [Demo Request]             │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**PRESENTER NOTES:**
```
Implementasi KDMP bisa dimulai segera. Proses tipikal 3 minggu: 
minggu pertama setup server dan install, minggu kedua input data 
master, minggu ketiga go live dan training. Tim kami siap 
mendukung dari awal sampai operasional.
```

---

## SLIDE 17: Q&A

**TITLE:**
```
Tanya Jawab
```

**CONTENT:**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│                    ❓ ❓ ❓ ❓ ❓                            │
│                                                             │
│                                                             │
│                                                             │
│                    ADA PERTANYA?                            │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                     │   │
│   │   📧 email@cooperativa.com                         │   │
│   │   📱 +62 xxx-xxxx-xxxx                              │   │
│   │   🌐 www.kdmp.co.id                                 │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**PRESENTER NOTES:**
```
Terima kasih atas perhatiannya. Sekarang saya buka sesi tanya 
jawab untuk membahas hal-hal yang ingin ditanyakan lebih lanjut.
```

---

## SLIDE 18: Thank You

**TITLE:**
```
Terima Kasih
```

**CONTENT:**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│                    🏛️ KOPI DESA                             │
│                    MERAH PUTIH                              │
│                                                             │
│                                                             │
│           "Membangun Cooperativa                          │
│            yang Modern & Transparan"                       │
│                                                             │
│                                                             │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                     │   │
│   │                                                     │   │
│   │        [Logo / Brand Cooperativa]                  │   │
│   │                                                     │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**PRESENTER NOTES:**
```
Terima kasih atas waktu dan perhatiannya. KDMP siap membantu 
cooperativa Anda memasuki era digital. Salam transparan!
```

---

## BONUS: Speaker Notes Global

```
=================================================================
TIPS PRESENTASI
=================================================================

1. BACA AUDIENS
   - Jika audiens teknis → fokus fitur & integrasi
   - Jika audiens manajemen → fokus benefit & ROI
   - Jika audiens anggota → fokus kemudahan & transparansi

2. ALUR NARASI SUGGESTED:
   - Kenalkan masalah (latar belakang)
   - Tawarkan solusi (fitur KDMP)
   - Buktikan (demo / studi kasus)
   - Tutup dengan CTA (hubungi kami)

3. DEMO RECOMMENDED SLIDES:
   - Slide 7: Transaksi Simpanan (langsung demo)
   - Slide 8: Alur Pinjaman (langsung demo)
   - Slide 11: Distribusi SHU (excel/laporan sample)

4. PERSIAPAN SEBELUM PRESENTASI:
   - ✓ Test login admin & member
   - ✓ Siapkan data dummy (anggota, simpanan, pinjaman)
   - ✓ Test semua alur (simpan, pinjam, angsur)
   - ✓ Siapkan laptop + projector
   - ✓ Backup internet connection

=================================================================
```

---

## CARA PAKAI (di Beautiful.ai):

1. Buka Beautiful.ai → Create New Presentation
2. Pilih template: **"Bold Statement"** atau **"Two Column"**
3. Copy setiap slide content ke dalam template
4. Adjust font/colors sesuai brand cooperatives
5. Add presenter notes dari kolom "PRESENTER NOTES"
6. Preview & Present!

---

*Generated for KDMP Presentation | Beautiful.ai Ready Format*
