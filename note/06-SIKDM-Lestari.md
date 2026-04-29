# SIKDM - Beautiful.ai Presentation Script

## Sistem Informasi Koperasi Desa Merah Putih

### KOPERASI LESTARI

---

## SLIDE 1: Cover/Title Slide

**TITLE:**

```
SIKDM
Sistem Informasi Koperasi
Desa Merah Putih
```

**SUBTITLE:**

```
KOPERASI LESTARI
Solusi Digital untuk
Koperasi Modern & Transparan
```

**PRESENTER NOTES:**

```
Selamat datang! Hari ini kita akan memperkenalkan SIKDM - Sistem
Informasi Koperasi Desa Merah Putih dari KOPERASI Lestari. Sebuah solusi
digital untuk mengelola operasional KOPERASI secara modern, efisien, dan transparan.
```

---

## SLIDE 2: Latar Belakang

**TITLE:**

```
Mengapa SIKDM Hadir?
```

**CONTENT (2 columns):**

**LEFT COLUMN - "Tantangan Lama":**

- Pencatatan manual yang rawan kesalahan
- Anggota sulit akses data sendiri
- Laporan membutuhkan waktu berhari-hari
- Transparansi yang rendah antar anggota

**RIGHT COLUMN - "Solusi SIKDM":**

- Otomasi seluruh proses pembukuan
- Akses real-time 24/7
- Laporan instan siap pakai
- Full transparency untuk anggota

**PRESENTER NOTES:**

```
Sebelum sistem digital, KOPERASI menghadapi banyak tantangan.
Pencatatan manual rentan salah, anggota harus datang ke kantor untuk
cek saldo, dan penyusunan laporan memakan waktu lama. SIKDM hadir
untuk menyelesaikan semua masalah ini.
```

---

## SLIDE 3: Tentang KOPERASI Lestari

**TITLE:**

```
KOPERASI LESTARI
Komunitas KOPERASI Koperasi Desa Merah Putih
```

**CONTENT (info cards):**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   📍 LOKASI                                                 │
│   ─────────                                                 │
│   Koperasi Koperasi Merah Putih                                          │
│   Jawa Barat, Indonesia                                      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   🌱 KOMODITAS                                              │
│   ──────────                                                │
│   KOPERASI Serba Guna                                     │
│   Simpan Pinjam, Perdagangan, Pertanian                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   👥 ANGGOTA                                                │
│   ─────────                                                │
│   Anggota aktif + keluarganya                          │
│   Masyarakat Koperasi Koperasi Merah Putih                              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   🎯 VISI                                                   │
│   ────                                                     │
│   Meningkatkan kesejahteraan anggota                      │
│   melalui management KOPERASI modern                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**PRESENTER NOTES:**

```
KOPERASI Lestari adalah komunitas yang berlokasi di Koperasi Koperasi Merah Putih.
Kami bergerak di bidang simpan pinjam, perdagangan, dan pertanian.
Visi kami adalah meningkatkan kesejahteraan anggota melalui management KOPERASI modern.
```

---

## SLIDE 4: Arsitektur Sistem

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
           │   • Anggota    │
           │   • Simpanan    │
           │   • Pinjaman    │
           │   • Ledger      │
           │   • Produk      │
           │   • Transaksi  │
           │                 │
           └─────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

URL AKSES:

👨‍💼 Admin: https://lestari.suite.my.id/admin

👤 Member: https://memberlestari.suite.my.id
```

**PRESENTER NOTES:**

```
Sistem SIKDM terdiri dari dua aplikasi yang terhubung ke satu database.
Aplikasi Admin untuk petugas mengelola data, Aplikasi Member untuk
anggota mengakses informasi mereka sendiri. Semua data tersimpan
terpusat sehingga tidak ada duplikasi atau ketidaksesuaian data.

Admin bisa diakses di https://lestari.suite.my.id/admin
Anggota bisa akses di https://memberlestari.suite.my.id
```

---

## SLIDE 5: Fitur Utama Admin

**TITLE:**

```
Kelola Semua dari Satu Dashboard
```

**CONTENT (grid 2x3):**

| **Simpan Pinjam** | **Manajemen Produk** | **Transaksi** |
| ----------------- | -------------------- | ------------- |
| Setor/tarik       | Kelola produk        | POS / Kasir   |
| Pinjaman          | Stok barang          | Penjualan     |
| Angsuran          | Harga                | Pembelian     |

| **Jurnal Otomatis** | **Laporan SHU** | **16 Buku Admin** |
| ------------------- | --------------- | ----------------- |
| Setiap transaksi    | Hitung bagi     | Daftar anggota    |
| langsung posting    | hasil otomatis  | buku kas dll      |

**PRESENTER NOTES:**

```
Dashboard admin memberikan akses ke semua fitur utama: pengelolaan
simpanan dan pinjaman, manajemen produk dan stok, transaksi POS,
jurnal yang terposting otomatis, perhitungan SHU, dan 16 buku administrasi.
```

---

## SLIDE 6: Fitur Utama Anggota (Member)

**TITLE:**

```
Kemudahan untuk Anggota
```

**CONTENT (list with icons):**

| 🏠  | **Dashboard Personal**     |
| --- | -------------------------- |
|     | Selalu tahu saldo & status |

| 📊  | **Riwayat Transaksi**         |
| --- | ----------------------------- |
|     | Simpanan, pinjaman, pembelian |

| 🛒  | **Info Produk**        |
| --- | ---------------------- |
|     | Katalog & harga barang |

| 💳  | **Ajukan Pinjaman** |
| --- | ------------------- |
|     | Kalkulasi otomatis  |

| 📰  | **Berita & Info**  |
| --- | ------------------ |
|     | Pengumuman terkini |

**PRESENTER NOTES:**

```
Aplikasi member memberikan kemandirian bagi anggota. Mereka bisa
melihat saldo kapan saja, mengajukan pinjaman dengan simulasi
angsuran, melihat katalog produk, membaca berita KOPERASI,
dan mengirim kritik saran tanpa harus datang ke kantor.
```

---

## SLIDE 7: Alur Setup Master Data

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
Setup                                            [4]
Produk &                                         Input
Stok                                            Simpanan
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
bisa satu-satu atau import Excel. Terakhir, input data produk
dan stok. Setelah ini, sistem sudah siap digunakan.
```

---

## SLIDE 8: Alur Transaksi Simpanan

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
    │  ✓ Saldo anggota di-update  │
    │  ✓ Posting ke Ledger/Journal │
    │                               │
    │  📄 Bukti transaksi siap     │
    │     untuk anggota             │
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

## SLIDE 9: Alur Pinjaman

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
              │  Anggota ajukan │
              │  via app/ admin │
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

## SLIDE 10: Alur Transaksi POS / Toko

**TITLE:**

```
Transaksi Toko - Point of Sale
```

**CONTENT (cycle diagram):**

```
              ┌──────────────────┐
              │                  │
              │  1. PILIH      │
              │  PRODUK         │
              │                  │
              │  Scan / Search  │
              │  barang         │
              │                  │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │                  │
              │  2. KERANJANG   │
              │                  │
              │  Add quantity   │
              │  & verify       │
              │                  │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │                  │
              │  3. PEMBAYARAN  │
              │                  │
              │  ○ Tunai          │
              │  ○ Transfer       │
              │  ○ Saldo Anggota  │
              │                  │
              └────────┬─────────┘
                       │
                       ▼
              ┌─────────────────────────────────┐
              │         OTOMATIS TERJADI:         │
              │                                   │
              │  ✓ Stok berkurang                 │
              │  ✓ Jurnal entry dibuat           │
              │  ✓ Kas/Bank bertambah           │
              │  ✓ Laporan penjualan             │
              └─────────────────────────────────┘
```

**PRESENTER NOTES:**

```
Fitur POS untuk toko KOPERASI. Anggota bisa beli barang di kasir,
bayar dengan tunai, transfer, atau langsung potong saldo simpanan.
Sistem otomatis kurangi stok, posting jurnal, dan generate laporan.
```

---

## SLIDE 11: Jurnal Otomatis

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
│  PENJUALAN TOKO                                            │
│  ─────────────────                                         │
│                                                             │
│  Barang A x 2              Kas       │  200.000      │
│  @ Rp 100.000               Penjualan│              │
│                               Barang  │  200.000      │
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
Ini adalah fitur kunci SIKDM. Setiap transaksi - setoran, penjualan,
pinjaman, angsuran - otomatis membuat jurnal entry. Ini berarti
Buku Kas selalu akurat tanpa input manual. Laporan keuangan
bisa dihasilkan kapan saja dengan data yang reliable.
```

---

## SLIDE 12: Perhitungan SHU

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
│  │   ├─ Penjualan Toko              Rp  80.000.000      │   │
│  │   ├─ Bunga Pinjaman               Rp  50.000.000      │   │
│  │   └─ Lainnya                      Rp  20.000.000      │   │
│  │                                                       │   │
│  │   BEBAN                        Rp  50.000.000      │   │
│  │   ├─ Gaji & Operasional          Rp  35.000.000      │   │
│  │   └─ Lainnya                      Rp  15.000.000      │   │
│  │   ═══════════════════════════════════════════════   │   │
│  │   SHU KOTOR                     Rp 100.000.000      │   │
│  │                                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ALOKASI SHU                                                │
│  ═════════════                                               │
│                                                             │
│  ┌────────────────────┐    ┌────────────────────┐         │
│  │  CADANGAN          │    │  BAGIAN ANGGOTA   │         │
│  │  Minimal 20%      │    │  Maksimal 80%       │         │
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

## SLIDE 13: Distribusi SHU per Anggota

**TITLE:**

```
Adil & Transparan untuk Anggota
```

**CONTENT (split calculation):**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  SHU BAGIAN ANGGOTA = Rp 80.000.000                        │
│                                                             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │  JASA MODAL (50%)     │  │  JASA ANGGOTA (50%)   │  │
│  │                         │  │                         │  │
│  │  Based on:              │  │  Based on:             │  │
│  │  Total Simpanan         │  │  Total Transaksi        │  │
│  │                         │  │  Simpanan + Pinjaman    │  │
│  │  Rumus:                │  │                         │  │
│  │  (Simpanan A / Total)  │  │  Rumus:                │  │
│  │  × 50% × SHU           │  │  (Transaksi A / Total)  │  │
│  │                         │  │  × 50% × SHU           │  │
│  │  = SHU Modal           │  │  = SHU Transaksi       │  │
│  └─────────────────────────┘  └─────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  CONTOH: ANGGOTA "BUDI"                             │   │
│  │                                                     │   │
│  │  Simpanan Budi: Rp 10.000.000                      │   │
│  │  Total Simpanan: Rp 500.000.000                    │   │
│  │                                                     │   │
│  │  SHU Modal = (10jt / 500jt) × 40jt = Rp 800.000  │   │
│  │                                                     │   │
│  │  ──────────────────────────────────────────────   │   │
│  │                                                     │   │
│  │  TOTAL SHU BUDI = SHU Modal + SHU Transaksi        │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**PRESENTER NOTES:**

```
Distribusi SHU menggunakan dua metrik: jasa modal berdasarkan
simpanan dan jasa anggota berdasarkan transaksi. Ini sesuai
dengan aturan KOPERASI. Perhitungan otomatis per anggota,
tinggal export untuk RAT.
```

---

## SLIDE 14: 16 Buku - Terpenuhi Otomatis

**TITLE:**

```
16 Buku Administrasi KOPERASI
```

**CONTENT (grid - checkmarks):**

```
┌───────────────────────┬──────────┐  ┌───────────────────────┬──────────┐
│ 1. Daftar Anggota   │    ✓     │  │ 9. Inventaris/Aset   │    ✓     │
├───────────────────────┼──────────┤  ├───────────────────────┼──────────┤
│ 2. Daftar Pengurus    │    ✓     │  │ 10. Ekspedisi/Surat   │    ✓     │
├───────────────────────┼──────────┤  ├───────────────────────┼──────────┤
│ 3. Daftar Pengawas    │    ✓     │  │ 11. Keputusan Rapat   │    ✓     │
├───────────────────────┼──────────┤  ├───────────────────────┼──────────┤
│ 4. Daftar Karyawan    │    ✓     │  │ 12. Kejadian Penting  │    ✓     │
├───────────────────────┼──────────┤  ├───────────────────────┼──────────┤
│ 5. Buku Tamu          │    ✓     │  │ 13. Buku Saran        │    ✓     │
├───────────────────────┼──────────┤  ├───────────────────────┼──────────┤
│ 6. Simpanan Anggota   │    ✓     │  │ 14. Stok/Produk     │    ✓     │
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
SIKDM memenuhi seluruh 16 buku administrasi yang diwajibkan
untuk KOPERASI Indonesia. Tidak hanya tersedia, semua buku
saling terintegrasi. Input di satu tempat langsung reflect
di buku terkait. Siap untuk audit kapan saja.
```

---

## SLIDE 15: Keamanan & Akses

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
│   URL Admin: https://lestari.suite.my.id/admin             │
│   URL Anggota: https://memberlestari.suite.my.id            │
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

## SLIDE 16: Teknologi

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
│   └─────────────────┘     │      ┌─────────────────┐        │
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
SIKDM dibangun dengan teknologi modern dan scalable. Frontend pakai
Next.js React yang cepat dan SEO-friendly. Backend pakai Payload
CMS yang flexible. Database PostgreSQL yang enterprise-grade.
Cloud-ready - bisa deploy di mana saja, storage S3, CDN support.
```

---

## SLIDE 17: Ringkasan Benefit

**TITLE:**

```
Benefits in Numbers
```

**CONTENT (big stats):**

```
┌───────────────┬───────────────┬───────────────┬───────────────┐
│               │               │               │               │
│     ⏱️        │      📊      │      💰       │      📦       │
│               │               │               │               │
│    WAKTU      │   TRANSPARAN  │   EFISIENSI   │   MONITORING  │
│               │               │               │   PRODUK      │
│   Proses      │   Anggota      │   Hemat        │   Stok &      │
│   90% lebih   │   Cek Data   │   Biaya        │   Penjualan   │
│   cepat       │   Sendiri     │   Operasional  │   Real-time  │
│               │               │               │               │
│               │               │               │               │
└───────────────┴───────────────┴───────────────┴───────────────┘

         ╔═══════════════════════════════════════════════╗
         ║                                                   ║
         ║   📱 Akses 24/7 dari Mana Saja               ║
         ║   🔐 Data Aman dengan Role-Based Access        ║
         ║   📋 16 Buku Adm. Siap Audit                  ║
         ║   📈 Laporan SHU Instan untuk RAT              ║
         ║   🛒 Manajemen Toko & Stok                    ║
         ║                                                   ║
         ╚═══════════════════════════════════════════════╝
```

**PRESENTER NOTES:**

```
Mari kita rangkum benefits SIKDM untuk KOPERASI Lestari. Waktu
proses 90% lebih cepat. Transparansi penuh - anggota bisa cek
sendiri. Efisiensi biaya operasional. Monitoring stok dan penjualan
real-time. Dan yang paling penting - akurasi perhitungan
yang tidak bisa dijamin dengan sistem manual.
```

---

## SLIDE 18: Next Steps

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
│   │              │  │ Anggota      │  │ Anggota      │     │
│   └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│                                                             │
│   📞 HUBUNGI KAMI                                          │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                     │   │
│   │   KOPERASI Lestari - Sistem SIKDM                 │   │
│   │                                                     │   │
│   │   Admin: https://lestari.suite.my.id/admin         │   │
│   │   Anggota: https://memberlestari.suite.my.id        │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**PRESENTER NOTES:**

```
Implementasi SIKDM bisa dimulai segera. Proses tipikal 3 minggu:
minggu pertama setup server dan install, minggu kedua input data
master anggota, minggu ketiga go live dan training. Tim kami siap
mendukung dari awal sampai operasional.
```

---

## SLIDE 19: Q&A

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
│   │   KOPERASI LESTARI                                 │   │
│   │   Sistem Informasi Koperasi Koperasi Merah Putih              │   │
│   │                                                     │   │
│   │   🌐 https://lestari.suite.my.id                   │   │
│   │   📧 info@KOPERASIlestari.id                      │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**PRESENTER NOTES:**

```
Terima kasih atas perhatiannya. Sekarang saya buka sesi tanya
jawab untuk membahas hal-hal yang ingin ditanyakan lebih lanjut
tentang SIKDM untuk KOPERASI Lestari.
```

---

## SLIDE 20: Thank You

**TITLE:**

```
Terima Kasih
```

**CONTENT:**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│                    🏛️🏛️🏛️🏛️🏛️                              │
│                                                             │
│               KOPERASI LESTARI                             │
│          Sistem Informasi Koperasi Koperasi Merah Putih              │
│                                                             │
│                                                             │
│           "Membangun Komunitas Anggota                      │
│            yang Modern & Transparan"                       │
│                                                             │
│                                                             │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                     │   │
│   │                                                     │   │
│   │        [Logo / Brand KOPERASI Lestari]            │   │
│   │                                                     │   │
│   │   🌐 lestari.suite.my.id                          │   │
│   │   📧 info@KOPERASIlestari.id                      │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**PRESENTER NOTES:**

```
Terima kasih atas waktu dan perhatiannya. SIKDM siap membantu
KOPERASI Lestari memasuki era digital untuk management
yang lebih modern dan transparan. Salam sejahtera untuk semua
anggota!
```

---

## BONUS: Speaker Notes Global

```
=================================================================
TIPS PRESENTASI UNTUK KOPERASI LESTARI
=================================================================

1. BACA AUDIENS
   - Jika audiens anggota → fokus kemudahan akses & manfaat
   - Jika audiens pengurus → fokus fitur & efisiensi
   - Jika audiens pemerintah/audit → fokus 16 buku & SHU

2. ALUR NARASI SUGGESTED:
   - Kenalkan KOPERASI Lestari (slide 3)
   - Tunjukkan masalah (slide 2)
   - Tawarkan solusi SIKDM (slide 5-6)
   - Demo fitur utama
   - Tutup dengan CTA (slide 18)

3. DEMO RECOMMENDED SLIDES:
   - Slide 8: Transaksi Simpanan
   - Slide 9: Alur Pinjaman
   - Slide 10: Transaksi POS/Toko
   - Slide 13: Distribusi SHU
   - Slide 14: 16 Buku

4. PERSIAPAN SEBELUM PRESENTASI:
   - ✓ Test login admin: https://lestari.suite.my.id/admin
   - ✓ Test login anggota: https://memberlestari.suite.my.id
   - ✓ Siapkan data dummy (anggota, simpanan, pinjaman, produk)
   - ✓ Test alur transaksi
   - ✓ Siapkan laptop + projector
   - ✓ Backup internet connection

5. POINTS UNTUK DISOROT:
   - Dashboard terpusat untuk semua kebutuhan KOPERASI
   - Simpan pinjam terintegrasi dengan jurnal otomatis
   - POS/Toko untuk贸易 kebutuhan anggota
   - SHU calculation otomatis
   - 16 buku administrasi terintegrasi

=================================================================
```

---

## CARA PAKAI (di Beautiful.ai):

1. Buka Beautiful.ai → Create New Presentation
2. Pilih template: **"Bold Statement"** atau **"Two Column"**
3. Copy setiap slide content ke dalam template
4. Adjust font/colors sesuai brand KOPERASI Lestari
5. Add presenter notes dari kolom "PRESENTER NOTES"
6. Preview & Present!

---

## RINGKASAN URL AKSES:

```
👨‍💼 ADMIN PANEL:  https://lestari.suite.my.id/admin

👤 MEMBER PANEL: https://memberlestari.suite.my.id

🌐 WEBSITE:        https://lestari.suite.my.id
```

---

_Generated for SIKDM - KOPERASI Lestari | Beautiful.ai Ready Format_
