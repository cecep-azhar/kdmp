# 04. Alur Sistem Lengkap: Master Data → Laporan SHU

## Gambaran Besar Alur Kerja

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          ALUR UTAMA KDMP                              │
└─────────────────────────────────────────────────────────────────────────┘

  ╔═══════════════╗     ╔═══════════════╗     ╔═══════════════╗
  ║  1. SETUP     ║ --> ║  2. OPERASI   ║ --> ║  3. AKHIR    ║
  ║  MASTER DATA  ║     ║  HARIAN       ║     ║  TAHUN       ║
  ╚═══════════════╝     ╚═══════════════╝     ╚═══════════════╝
        │                     │                     │
        ▼                     ▼                     ▼
  ┌───────────┐        ┌───────────┐        ┌───────────┐
  │ Buat Akun │        │ Transaksi │        │ Hitung    │
  │ & Profil  │        │ Simpanan  │        │ SHU       │
  │ Anggota  │        │ & Pinjaman│        │           │
  └───────────┘        └───────────┘        └───────────┘
                           │                     │
                           ▼                     ▼
                    ┌───────────┐        ┌───────────┐
                    │ Otomatis  │        │ Laporan   │
                    │ Posting   │        │ SHU &    │
                    │ ke Ledger │        │ Distribui │
                    └───────────┘        └───────────┘
```

---

## TAHAP 1: Setup Master Data

### Alur Pembuatan Data Master

```
┌─────────────────────────────────────────────────────────────────┐
│                  SETUP MASTER DATA (Sekali Saat Awal)          │
└─────────────────────────────────────────────────────────────────┘

  [MULAI]
     │
     ▼
┌──────────────┐
│ 1. Buat Akun │
│    Admin     │
└──────┬───────┘
       │
       ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ 2. Buat Profil   │    │ 3. Buat Chart    │    │ 4. Setup        │
│    Organisasi    │───▶│    of Accounts   │───▶│    Produk POS   │
│    (Settings)   │    │    (9 Akun dasar)│    │                 │
└──────────────────┘    └──────────────────┘    └──────────────────┘
                                                         │
                                                         ▼
                                               ┌──────────────────┐
                                               │ 5. Input Data    │
                                               │    Awal Aset     │
                                               └──────────────────┘
                                                         │
                                                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                      DAFTAR ANGGOTA (Batch/Satu-satu)           │
└──────────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │                     CARA 1: INPUT SATU-SATU                  │
  └─────────────────────────────────────────────────────────────┘

  [Tambah Anggota Baru]
         │
         ▼
  ┌─────────────────┐
  │ Isi Formulir:   │
  │ • Nama Lengkap  │
  │ • NIK           │
  │ • Tanggal Lahir │
  │ • Alamat        │
  │ • No. HP        │
  │ • Tanggal Masuk │
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐     ┌─────────────────┐
  │ Generate ID     │     │ Buat Akun Login │
  │ Otomatis        │     │ Anggota         │
  │ KMP-YYYYMMDD-NN │     │ (Email + Pass)  │
  └────────┬────────┘     └────────┬────────┘
           │                        │
           └───────────┬────────────┘
                       ▼
              ┌─────────────────┐
              │ Simpan Anggota  │
              │ ✓ Buku Daftar   │
              │   Anggota       │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Input Simpanan   │◀── WAJIB
              │ Pokok + Wajib   │
              │ Pertama         │
              └────────┬────────┘
                       │
                       ▼
                [SELESAI]
                       │
                       ▼
          ┌────────────────────────┐
          │ 16 Buku: Buku Daftar   │
          │       Anggota ✓      │
          └────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │                   CARA 2: IMPORT BATCH (Excel)              │
  └─────────────────────────────────────────────────────────────┘

  [Siapkan Data Excel/CSV]
         │
         ▼
  ┌─────────────────┐
  │ Format Kolom:   │
  │ Nama|NIK|Tgl    │
  │ Lahir|Alamat|   │
  │ HP|Tgl Masuk    │
  └────────┬────────┘
           │
           ▼
  [Upload ke Admin]
           │
           ▼
  [Generate ID Massal]
           │
           ▼
  [Kirim Email Akun]
           │
           ▼
    [SELESAI]

```

### Alur Detail: Setup Chart of Accounts

```
┌─────────────────────────────────────────────────────────────────┐
│              9 AKUN UTAMA (9 BUKU DASAR)                        │
└─────────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │                  AKTIVA (Kelompok 1)                        │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
  │ 1-1001     │     │ 1-1002     │     │ 1-1003     │
  │ KAS        │     │ BANK        │     │ PIUTANG    │
  │ (Tunai)    │     │             │     │ ANGGOTA    │
  └─────────────┘     └─────────────┘     └─────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │                  KEWAJIBAN (Kelompok 2)                     │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
  │ 2-1001     │     │ 2-1002     │     │ 2-1003     │
  │ SIMPANAN   │     │ SIMPANAN   │     │ SIMPANAN   │
  │ POKOK      │     │ WAJIB      │     │ SUKARELA   │
  └─────────────┘     └─────────────┘     └─────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │                  PENDAPATAN (Kelompok 4)                    │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────┐     ┌─────────────┐
  │ 4-1001     │     │ 4-1002     │
  │ BUNGA      │     │ PENJUALAN  │
  │ PINJAMAN   │     │ TOKO/POS   │
  └─────────────┘     └─────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │                  BEBAN (Kelompok 5)                         │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────┐     ┌─────────────┐
  │ 5-1001     │     │ 5-1002     │
  │ BEBAN      │     │ BEBAN      │
  │ OPERASIONAL │     │ SHU        │
  └─────────────┘     └─────────────┘
```

---

## TAHAP 2: Operasional Harian

### Alur Transaksi Simpanan

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRANSAKSI SIMPANAN                           │
└─────────────────────────────────────────────────────────────────┘

  [Anggota Datang ingin Menabung]
           │
           ▼
  ┌─────────────────────┐
  │ Admin Login         │
  │ Menu: Simpan Pinjam │
  │        → Simpanan   │
  └──────────┬──────────┘
              │
              ▼
  ┌─────────────────────┐     ┌─────────────────────┐
  │ Pilih/Jual Anggota  │     │ Atau Scan Barcode   │
  │ [Cari: Nama/ID]     │     │ Kartu Anggota       │
  └──────────┬──────────┘     └──────────┬──────────┘
              │                           │
              └───────────┬───────────────┘
                          ▼
               ┌─────────────────────┐
               │ Pilih Jenis:        │
               │ • Simpanan Pokok   │◀── Hanya sekali
               │ • Simpanan Wajib   │◀── Rutin bulanan
               │ • Simpanan Sukarela │◀── Kapan saja
               └──────────┬──────────┘
                          │
                          ▼
               ┌─────────────────────┐
               │ Pilih Tipe:         │
               │ ○ Setor             │
               │ ○ Tarik             │
               └──────────┬──────────┘
                          │
                          ▼
               ┌─────────────────────┐
               │ Masukkan Jumlah     │
               │ Rp [__________]    │
               └──────────┬──────────┘
                          │
                          ▼
               ┌─────────────────────┐
               │ Pilih Metode:      │
               │ ○ Tunai            │
               │ ○ Transfer         │
               │ ○ Auto Debet       │
               └──────────┬──────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │   KONFIRMASI  │
                  │               │
                  │ Anggota: XX   │
                  │ Jenis: Sukarela│
                  │ Tipe: Setor   │
                  │ Jumlah: RpXXX │
                  │               │
                  │ [Batal] [Ya]  │
                  └───────┬───────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ [SIMPAN]        │
                 └────────┬────────┘
                          │
                          ▼
        ┌───────────────────────────────────────────┐
        │          PROSES OTOMATIS SISTEM          │
        ├───────────────────────────────────────────┤
        │                                           │
        │  ✓ Generate ID Transaksi                │
        │    SIMP-YYYYMMDD-NNNNNN                  │
        │                                           │
        │  ✓ Update Saldo Anggota                  │
        │    Saldo += Jumlah (jika setor)          │
        │    Saldo -= Jumlah (jika tarik)          │
        │                                           │
        │  ✓ POSTING OTOMATIS KE LEDGER            │
        │    ┌─────────────────────────────┐       │
        │    │ Jurnal:                     │       │
        │    │ Tanggal: [Hari ini]         │       │
        │    │ Deskripsi: Setoran Sukarela│       │
        │    │                             │       │
        │    │ KAS          (Debet)  XXX   │       │
        │    │ SIMP.SUKARELA(Kredit) XXX  │       │
        │    └─────────────────────────────┘       │
        │                                           │
        └───────────────────────────────────────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ [SELESAI]     │
                  │               │
                  │ Tampilkan:    │
                  │ • Bukti Trans │
                  │ • Slip untuk  │
                  │   Anggota     │
                  └───────────────┘

  ╔═════════════════════════════════════════════════════════════╗
  ║  HASIL DI 16 BUKU:                                          ║
  ║  ✓ Buku Simpanan Anggota                                    ║
  ║  ✓ Buku Kas (Ledger)                                        ║
  ╚═════════════════════════════════════════════════════════════╝
```

### Alur Transaksi Pinjaman

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRANSAKSI PINJAMAN                           │
└─────────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │                    ALUR PENGAMBILAN PINJAMAN                │
  └─────────────────────────────────────────────────────────────┘

  [Anggota Mengajukan Pinjaman]
           │
           ▼
  ┌─────────────────────┐
  │ 16 Buku: Buku      │
  │ Daftar Anggota     │
  │ (Cek Kelayakan)    │
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │ Syarat Terpenuhi?  │
  │ • Anggota aktif   │
  │ • Simpanan pokok   │───Tidak───▶ [Tolak]
  │   sudah lunas      │              [Alasan]
  │ • Tidak punya      │
  │   pinjaman macet   │
  └──────────┬──────────┘
             │Ya
             ▼
  ┌─────────────────────┐
  │ Pengajuan Pinjaman  │
  │ (Via Aplikasi       │
  │  Member atau Admin) │
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │ Input:             │
  │ • Jumlah Pinjaman  │
  │ • Tenor (3-36 bln) │
  │ • Bunga (%)        │
  │ • Tujuan Pinjaman  │
  │ • Jaminan (opsional)│
  └──────────┬────────┘
             │
             ▼
  ┌─────────────────────┐
  │ Sistem Hitung:      │
  │ Angsuran/Bulan =   │
  │ (Pokok + Bunga)    │
  │ / Tenor            │
  │                     │
  │ Total Pembayaran = │
  │ Pokok + Total Bunga│
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │ Admin Review:       │
  │ • Cek kelayakan    │
  │ • Validasi dokumen  │
  │ • Setuju / Tolak   │
  └──────────┬──────────┘
             │
       ┌─────┴─────┐
       │           │
    [Setuju]    [Tolak]
       │           │
       ▼           ▼
  ┌─────────┐  ┌─────────┐
  │ Status: │  │ Status: │
  │ Disetuji│  │ Ditolak │
  └────┬────┘  └─────────┘
       │
       ▼
  ┌─────────────────────┐
  │ Pencairan Dana      │
  │ (Kasir/Teller)     │
  └──────────┬──────────┘
             │
             ▼
  ┌───────────────────────────────────────────┐
  │          PROSES OTOMATIS SISTEM           │
  ├───────────────────────────────────────────┤
  │                                           │
  │  ✓ Generate ID Pinjaman                  │
  │    PIN-YYYYMMDD-NNNNNN                   │
  │                                           │
  │  ✓ Generate Jadwal Angsuran               │
  │    (Tenor = N bulan)                      │
  │    ┌─────────────────────────────┐         │
  │    │ Angsuran 1: [Tgl+1bln]    │         │
  │    │ Angsuran 2: [Tgl+2bln]    │         │
  │    │ ...                        │         │
  │    │ Angsuran N: [Tgl+Nbln]    │         │
  │    └─────────────────────────────┘         │
  │                                           │
  │  ✓ POSTING OTOMATIS KE LEDGER            │
  │    ┌─────────────────────────────┐         │
  │    │ Jurnal Pencairan:          │         │
  │    │ PIUTANG PINJAMAN (Debet)   │         │
  │    │ KAS (Kredit)               │         │
  │    └─────────────────────────────┘         │
  │                                           │
  └───────────────────────────────────────────┘
             │
             ▼
  [Status: PINJAMAN AKTIF]

  ╔═════════════════════════════════════════════════════════════╗
  ║  HASIL DI 16 BUKU:                                         ║
  ║  ✓ Buku Pinjaman Anggota                                   ║
  ║  ✓ Buku Kas (Ledger)                                       ║
  ╚═════════════════════════════════════════════════════════════╝

  ┌─────────────────────────────────────────────────────────────┐
  │                    ALUR PEMBAYARAN ANGSURAN                 │
  └─────────────────────────────────────────────────────────────┘

  [Anggota Bayar Angsuran]
           │
           ▼
  ┌─────────────────────┐
  │ Admin:             │
  │ Menu Pinjaman      │
  │ Cari/No.Pinjaman   │
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │ Lihat Detail:       │
  │ • Data Peminjam    │
  │ • Sisa Pinjaman    │
  │ • Jadwal Angsuran  │
  │ • Angsuran Belum   │
  │   Dibayar          │
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │ Pilih Angsuran      │
  │ yang akan dibayar   │
  │ ☑ Angsuran #1      │
  │ ☐ Angsuran #2      │
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │ Konfirmasi Bayar:   │
  │                     │
  │ Peminjam: [Nama]    │
  │ Angsuran Ke: 1      │
  │ Jatuh Tempo: [Tgl]  │
  │ Pokok: Rp XXX       │
  │ Bunga: Rp XXX       │
  │ Total: Rp XXX       │
  │                     │
  │ Metode: [Dropdown]  │
  │ [Batal] [Bayar]    │
  └──────────┬──────────┘
             │
             ▼
  ┌───────────────────────────────────────────┐
  │          PROSES OTOMATIS SISTEM           │
  ├───────────────────────────────────────────┤
  │                                           │
  │  ✓ Update Status Angsuran: Paid          │
  │  ✓ Update Tanggal Bayar                   │
  │  ✓ Kurangi Sisa Pinjaman                  │
  │                                           │
  │  ✓ POSTING OTOMATIS KE LEDGER            │
  │    ┌─────────────────────────────┐        │
  │    │ Jurnal Angsuran:            │        │
  │    │ KAS (Debet)          XXX    │        │
  │    │ PIUTANG (Kredit)    XXX    │        │
  │    │ PENDAPATAN BUNGA    XXX    │        │
  │    └─────────────────────────────┘        │
  │                                           │
  └───────────────────────────────────────────┘
             │
             ▼
  ┌─────────────────────┐
  │ Sisa Pinjaman = 0?  │
  │                     │
  │ Ya → [PINJAMAN     │
  │      LUNAS]         │
  │                     │
  │ Tidak → Sisa -= XXX │
  │          [MASIH AKTIF]│
  └─────────────────────┘
```

### Alur Transaksi POS (Toko)

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRANSAKSI TOKO / POS                         │
└─────────────────────────────────────────────────────────────────┘

  [Anggota Belanja di Toko]
           │
           ▼
  ┌─────────────────────┐
  │ Kasir: Buka POS     │
  │ Scan/Input Barang   │
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │ Keranjang:          │
  │ • Item 1    Rp XX   │
  │ • Item 2    Rp XX   │
  │ • Item 3    Rp XX   │
  │ ─────────────────── │
  │ TOTAL      Rp XXX   │
  │                     │
  │ [Hapus] [Tambah]   │
  │ [Proses Bayar]     │
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │ Pilih Metode Bayar: │
  │                     │
  │ ○ Tunai            │
  │ ○ Transfer          │
  │ ○ Potong Simpanan   │◀── Potong otomatis
  │   (Cek Saldo dulu)  │    dari simpanan
  └──────────┬──────────┘
             │
             ▼
  ┌───────────────────────────────────────────┐
  │          PROSES OTOMATIS SISTEM           │
  ├───────────────────────────────────────────┤
  │                                           │
  │  ✓ Generate ID Transaksi                  │
  │  ✓ Kurangi Stok Barang                   │
  │                                           │
  │  ✓ POSTING KE LEDGER                     │
  │    ┌─────────────────────────────┐        │
  │    │ Jurnal Penjualan:           │        │
  │    │ KAS/Piutang (Debet)  XXX   │        │
  │    │ PENJUALAN (Kredit)   XXX   │        │
  │    │                             │        │
  │    │ (Jurnal COGS saat barang    │        │
  │    │  keluar dari stok)          │        │
  │    └─────────────────────────────┘        │
  │                                           │
  └───────────────────────────────────────────┘

  ╔═════════════════════════════════════════════════════════════╗
  ║  HASIL DI 16 BUKU:                                         ║
  ║  ✓ Buku Kas (Ledger)                                       ║
  ║  ✓ Buku Persediaan/Stok (Assets)                          ║
  ╚═════════════════════════════════════════════════════════════╝
```

---

## TAHAP 3: Akhir Tahun → Laporan SHU

### Alur Perhitungan SHU

```
┌─────────────────────────────────────────────────────────────────┐
│            PERHITUNGAN SHU (Sisa Hasil Usaha)                  │
│                                                                     │
│   Dilakukan: Akhir tahun buku / Saat RAT                         │
└─────────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │                    LANGKAH 1: HITUNG PENDAPATAN            │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │                    PENDAPATAN TAHUN INI                      │
  └─────────────────────────────────────────────────────────────┘

  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │ Pendapatan   │     │ Pendapatan   │     │ Pendapatan   │
  │ Bunga        │     │ Penjualan    │     │ Lainnya      │
  │ Pinjaman     │     │ Toko/POS     │     │ (Laba Aset, │
  │              │     │              │     │  dll)        │
  └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
         │                    │                    │
         └──────────┬─────────┘                    │
                    │                              │
                    ▼                              │
           ┌────────────────┐                      │
           │ TOTAL PENDAPATAN│◀─────────────────────┘
           │    Rp XXX.XXX   │
           └────────┬────────┘
                    │
  ┌─────────────────┴─────────────────────────────┐
  │                   LANGKAH 2: HITUNG BEBAN                            │
  └──────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │                      BEBAN TAHUN INI                        │
  └─────────────────────────────────────────────────────────────┘

  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │ Beban Gaji │     │ Beban       │     │ Beban       │
  │ & Operasonal│     │ Penyusutan  │     │ Lainnya     │
  │            │     │ Asset       │     │            │
  └──────┬─────┘     └──────┬───────┘     └──────┬─────┘
         │                  │                    │
         └──────────┬───────┘                    │
                    │                            │
                    ▼                            │
           ┌────────────────┐                    │
           │ TOTAL BEBAN   │◀────────────────────┘
           │   Rp XXX.XXX  │
           └────────┬───────┘
                    │
  ┌─────────────────┴──────────────────────────────────────────┐
  │                 LANGKAH 3: HITUNG SHU KOTOR                 │
  └─────────────────────────────────────────────────────────────┘

           ┌────────────────┐
           │   PENDAPATAN   │
           │   Rp XXX.XXX   │
           └───────┬────────┘
                   │ -
                   ▼
           ┌────────────────┐
           │    BEBAN       │
           │   Rp XXX.XXX   │
           └───────┬────────┘
                   │ =
                   ▼
           ┌────────────────┐
           │  SHU KOTOR    │◀── Laba Sebelum Pajak
           │  Rp XXX.XXX    │
           └───────┬────────┘
                   │
  ┌────────────────┴─────────────────────────────────────────┐
  │              LANGKAH 4: ALOKASI SHU                      │
  │                                                             │
  │   Sesuai UU No. 25 Tahun 1992 & PERMEN 14/2020            │
  └───────────────────────────────────────────────────────────┘

           ┌────────────────┐
           │   SHU KOTOR    │
           │   Rp XXX.XXX   │
           └───────┬────────┘
                   │
         ┌────────┴────────┐
         │                   │
         ▼                   ▼
  ┌──────────────┐    ┌──────────────┐
  │ CADANGAN    │    │ SHU BAGIAN   │
  │ MIN 20%    │    │ ANGGOTA      │
  │              │    │ SISANYA      │
  │              │    │ (70-80%)    │
  └──────┬───────┘    └──────┬───────┘
         │                   │
         ▼                   ▼
  ┌──────────────┐    ┌──────────────────────┐
  │ Dana Cadangan│    │ SHU BAGIAN ANGGOTA  │
  │ (Tidak      │    │                     │
  │ dibagi/ditabung│   │ Dibagi berdasarkan: │
  │              │    │ 1. Jasa Modal (%)  │
  └──────────────┘    │    (dari simpanan)  │
                      │ 2. Jasa Anggota (%) │
                      │    (dari transaksi) │
                      └──────────┬───────────┘
                                 │
  ┌──────────────────────────────┴──────────────────────────┐
  │              LANGKAH 5: DISTRIBUSI PER ANGGOTA             │
  └───────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │                 HITUNG SHU PER ANGGOTA                      │
  └─────────────────────────────────────────────────────────────┘

  Contoh Perhitungan:

  SHU Bagian Anggota = Rp 80.000.000

  ┌─────────────────────────────────────────────────────────────┐
  │                  JASA MODAL (50%)                          │
  └─────────────────────────────────────────────────────────────┘

  SHU Jasa Modal = 50% × Rp 80.000.000 = Rp 40.000.000

  ┌─────────────────────────────────────────────────────────────┐
  │    SHU Per Anggota = (Saldo Simpanan Anggota / Total     │
  │                        Simpanan Seluruh Anggota)           │
  │                        × SHU Jasa Modal                    │
  └─────────────────────────────────────────────────────────────┘

  Contoh:
  - Total Simpanan Semua Anggota = Rp 500.000.000
  - Simpanan Budi = Rp 10.000.000
  - SHU Jasa Modal Budi = (10jt/500jt) × 40jt = Rp 800.000

  ┌─────────────────────────────────────────────────────────────┐
  │                  JASA ANGGOTA (50%)                        │
  └─────────────────────────────────────────────────────────────┘

  SHU Jasa Anggota = 50% × Rp 80.000.000 = Rp 40.000.000

  ┌─────────────────────────────────────────────────────────────┐
  │    SHU Per Anggota = (Total Transaksi Anggota / Total     │
  │                        Transaksi Seluruh Anggota)          │
  │                        × SHU Jasa Anggota                  │
  │                                                             │
  │  Transaksi = Simpanan + Pinjaman                           │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │                  TOTAL SHU PER ANGGOTA                      │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │  Total SHU Budi = SHU Jasa Modal + SHU Jasa Anggota        │
  │                 = Rp 800.000 + Rp XXX                      │
  │                 = Rp XXX.XXX                               │
  └─────────────────────────────────────────────────────────────┘
```

### Alur Akhir Tahun (RAT)

```
┌─────────────────────────────────────────────────────────────────┐
│              PROSES AKHIR TAHUN / RAT                          │
└─────────────────────────────────────────────────────────────────┘

  [1. CLOSING BUKU]
           │
           ▼
  ┌─────────────────────┐
  │ Tutup Periode       │
  │ Buku Tahun Berjalan │
  │ (12 Bulan)          │
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │ Buat Saldo Awal     │
  │ Tahun Depan         │
  │ (Carry Forward)     │
  └──────────┬──────────┘
             │
  [2. LAPORAN KEUANGAN]
             │
             ▼
  ┌─────────────────────────────────────────────────────────┐
  │                                                         │
  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
  │  │   NERACA    │  │ LAPORAN    │  │  ARUS KAS   │     │
  │  │(Balance     │  │ LABA RUGI  │  │             │     │
  │  │  Sheet)     │  │            │  │             │     │
  │  └─────────────┘  └─────────────┘  └─────────────┘     │
  │                                                         │
  │  ┌─────────────────────────────────────────────────┐   │
  │  │              SHU DISTRIBUSI                    │   │
  │  │                                                 │   │
  │  │  Total SHU: Rp XXX.XXX                         │   │
  │  │  Cadangan: 20% → Rp XX.XXX                     │   │
  │  │  Anggota: 80% → Rp XX.XXX                      │   │
  │  │                                                 │   │
  │  │  Per Anggota: [Daftar SHU masing-masing]        │   │
  │  │                                                 │   │
  │  │  [Download Laporan]  [Download Daftar SHU]      │   │
  │  └─────────────────────────────────────────────────┘   │
  │                                                         │
  └─────────────────────────────────────────────────────────┘
             │
  [3. RAT - Rapat Anggota Tahunan]
             │
             ▼
  ┌─────────────────────┐
  │Agenda RAT:          │
  │• Pembahasan Laporan │
  │  Keuangan          │
  │• Persetujuan SHU    │
  │• Pengesahan        │
  │  Distributions SHU  │
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │4. Distribusi SHU    │
  │                     │
  │ ○ Tunai (diambil)  │
  │ ○ Transfer          │
  │ ○ Ditabung          │
  │   (tambah simpanan)│
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │5. Posting ke Ledger │
  │                     │
  │ SHU - Cadangan     │
  │ SHU - Ditahan      │
  │ SHU - Bagian       │
  │   Anggota          │
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │ SELESAI             │
  │                     │
  │ 16 Buku Updated:    │
  │ ✓ Buku Kas         │
  │ ✓ Buku SHU         │
  │ ✓ Buku Perubahan   │
  │   Modal            │
  └─────────────────────┘
```

---

## Ringkasan: 16 Buku vs Aktivitas

```
┌─────────────────────────────────────────────────────────────────┐
│              PETA 16 BUKU → AKTIVITAS SISTEM                   │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────┬────────────────────────────────────────────┐
│ NAMA BUKU           │ AKTIVITAS / TRANSAKSI                      │
├────────────────────┼────────────────────────────────────────────┤
│ 1. Daftar Anggota  │ Input anggota baru                          │
├────────────────────┼────────────────────────────────────────────┤
│ 2. Daftar Pengurus  │ Input data pengurus                         │
├────────────────────┼────────────────────────────────────────────┤
│ 3. Daftar Pengawas  │ Input data pengawas                         │
├────────────────────┼────────────────────────────────────────────┤
│ 4. Daftar Karyawan  │ Input data karyawan                         │
├────────────────────┼────────────────────────────────────────────┤
│ 5. Buku Tamu        │ Check-in tamu/penunjung                     │
├────────────────────┼────────────────────────────────────────────┤
│ 6. Simpanan Anggota │ Transaksi setor/tarik simpanan             │
├────────────────────┼────────────────────────────────────────────┤
│ 7. Pinjaman Anggota │ Pengajuan & pelunasan pinjaman             │
├────────────────────┼────────────────────────────────────────────┤
│ 8. Kas / Jurnal      │ OTOMATIS dari semua transaksi              │
├────────────────────┼────────────────────────────────────────────┤
│ 9. Inventaris/Aset  │ Pembelian & penyusutan aset                │
├────────────────────┼────────────────────────────────────────────┤
│10. Buku Ekspedisi    │ Surat masuk & keluar                       │
├────────────────────┼────────────────────────────────────────────┤
│11. Buku Keputusan    │ Notulensi rapat (RAT, RAT, dll)           │
│    Rapat             │                                            │
├────────────────────┼────────────────────────────────────────────┤
│12. Buku Kejadian     │ Log penting (system audit)                 │
│    Penting           │                                            │
├────────────────────┼────────────────────────────────────────────┤
│13. Buku Saran        │ Masukan & kritik anggota                   │
├────────────────────┼────────────────────────────────────────────┤
│14. Toko/POS          │ Transaksi penjualan barang                 │
├────────────────────┼────────────────────────────────────────────┤
│15. Berita            │ Pengumuman & informasi                     │
├────────────────────┼────────────────────────────────────────────┤
│16. SHU              │ Perhitungan & distribusi SHU akhir tahun   │
└────────────────────┴────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════
  ✓ = Ter-create secara OTOMATIS oleh sistem
  ○ = Di-input manual oleh admin
═══════════════════════════════════════════════════════════════════
```

---

## Quick Reference: Langkah-Langkah Harian

```
┌─────────────────────────────────────────────────────────────────┐
│                  CHECKLIST HARIAN ADMIN                        │
└─────────────────────────────────────────────────────────────────┘

PAGI (Setoran Biasa):
  □ Cek daftar simpanan wajib hari ini
  □ Proses setoran yang masuk
  □ Print bukti untuk anggota

SIANG (Pinjaman):
  □ Review pengajuan pinjaman baru
  □ Cairkan pinjaman yang disetujui
  □ Proses pembayaran angsuran

SORE (Toko):
  □Input transaksi POS penjualan
  □Cek stok barang
  □Rekap kas hari ini

AKHIR HARI:
  □Cek semua posting ke ledger
  □Rekonsiliasi kas
  □Backup data (auto)
```
