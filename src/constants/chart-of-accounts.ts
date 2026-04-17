/**
 * Chart of Accounts Constants
 * Referensi: Standar Akuntansi Keuangan untuk Koperasi
 * Berdasarkan UU Perkoperasian No. 25 Tahun 1992
 */

// Asset / Aset
export const COA = {
  // Aset Lancar
  KAS: '1-1001',                    // Kas
  BANK: '1-1002',                   // Bank
  PIUTANG_PINJAMAN: '1-1003',       // Piutang Pinjaman Anggota
  PIUTANG_USAHA: '1-1004',         // Piutang Usaha
  PERSEDIAAN: '1-1005',             // Persediaan Barang
  PERLENGKAPAN: '1-1006',          // Perlengkapan

  // Aset Tetap
  PERALATAN_KANTOR: '1-2001',      // Peralatan Kantor
  KENDARAAN: '1-2002',              // Kendaraan
  BANGUNAN: '1-2003',              // Bangunan
  TANAH: '1-2004',                  // Tanah
  AKUMULASI_PENYUSUTAN: '1-2099',  // Akumulasi Penyusutan

  // Liabilitas / Kewajiban
  SIMPANAN_POKOK: '2-1001',        // Simpanan Pokok Anggota
  SIMPANAN_WAJIB: '2-1002',        // Simpanan Wajib Anggota
  SIMPANAN_SUKARELA: '2-1003',     // Simpanan Sukarela Anggota
  HUTANG_USAHA: '2-2000',          // Hutang Usaha
  HUTANG_BANK: '2-2001',           // Hutang Bank
  DANA_CADANGAN: '2-2002',         // Dana Cadangan

  // Ekuitas / Modal
  MODAL_DISETOR: '3-1001',          // Modal Disetor
  MODAL_DONASI: '3-1002',          // Modal Donasi
  SHU_TAHUN_BERJALAN: '3-1003',   // SHU Tahun Berjalan
  SHU_TAHUN_LALU: '3-1004',        // SHU Tahun Lalu

  // Pendapatan
  PENDAPATAN_PENJUALAN: '4-1001',   // Pendapatan Penjualan Barang
  PENDAPATAN_JASA_SIMPAN_PINJAM: '4-1002', // Pendapatan Jasa Simpan Pinjam
  PENDAPATAN_BUNGA_PINJAMAN: '4-1003', // Pendapatan Bunga Pinjaman
  PENDAPATAN_ADMINISTRASI: '4-1004', // Pendapatan Administrasi
  PENDAPATAN_LAIN: '4-1005',       // Pendapatan Lain-lain

  // Beban
  BEBAN_GAJIH: '5-1001',            // Beban Gaji & Honorarium
  BEBAN_SEWA: '5-1002',            // Beban Sewa
  BEBAN_LISTRIK_AIR: '5-1003',     // Beban Listrik & Air
  BEBAN_TELEPON: '5-1004',         // Beban Telepon & Internet
  BEBAN_ATK: '5-1005',             // Beban ATK & Perlengkapan
  BEBAN_PENYUSUTAN: '5-1006',      // Beban Penyusutan
  BEBAN_ADMIN_BANK: '5-1007',     // Beban Administrasi Bank
  BEBAN_TRANSPORTASI: '5-1008',    // Beban Transportasi
  BEBAN_RAPAT_RAT: '5-1009',       // Beban Rapat & RAT
  BEBAN_PENDIDIKAN: '5-1010',      // Beban Pendidikan & Pelatihan
  BEBAN_BUNGA: '5-1011',           // Beban Bunga
  HPP: '5-1012',                   // Harga Pokok Penjualan
  BEBAN_LAIN: '5-1099',            // Beban Lain-lain
} as const

export type COA_CODE = typeof COA[keyof typeof COA]

/**
 * Mapping nama akun ke kode untuk lookup
 */
export const COA_NAMES: Record<string, string> = {
  // Aset
  [COA.KAS]: 'Kas',
  [COA.BANK]: 'Bank',
  [COA.PIUTANG_PINJAMAN]: 'Piutang Pinjaman Anggota',
  [COA.PIUTANG_USAHA]: 'Piutang Usaha',
  [COA.PERSEDIAAN]: 'Persediaan Barang',
  [COA.PERLENGKAPAN]: 'Perlengkapan',
  [COA.PERALATAN_KANTOR]: 'Peralatan Kantor',
  [COA.KENDARAAN]: 'Kendaraan',
  [COA.BANGUNAN]: 'Bangunan',
  [COA.TANAH]: 'Tanah',
  [COA.AKUMULASI_PENYUSUTAN]: 'Akumulasi Penyusutan',
  // Kewajiban
  [COA.SIMPANAN_POKOK]: 'Simpanan Pokok Anggota',
  [COA.SIMPANAN_WAJIB]: 'Simpanan Wajib Anggota',
  [COA.SIMPANAN_SUKARELA]: 'Simpanan Sukarela Anggota',
  [COA.HUTANG_USAHA]: 'Hutang Usaha',
  [COA.HUTANG_BANK]: 'Hutang Bank',
  [COA.DANA_CADANGAN]: 'Dana Cadangan',
  // Ekuitas
  [COA.MODAL_DISETOR]: 'Modal Disetor',
  [COA.MODAL_DONASI]: 'Modal Donasi',
  [COA.SHU_TAHUN_BERJALAN]: 'SHU Tahun Berjalan',
  [COA.SHU_TAHUN_LALU]: 'SHU Tahun Lalu',
  // Pendapatan
  [COA.PENDAPATAN_PENJUALAN]: 'Pendapatan Penjualan Barang',
  [COA.PENDAPATAN_JASA_SIMPAN_PINJAM]: 'Pendapatan Jasa Simpan Pinjam',
  [COA.PENDAPATAN_BUNGA_PINJAMAN]: 'Pendapatan Bunga Pinjaman',
  [COA.PENDAPATAN_ADMINISTRASI]: 'Pendapatan Administrasi',
  [COA.PENDAPATAN_LAIN]: 'Pendapatan Lain-lain',
  // Beban
  [COA.BEBAN_GAJIH]: 'Beban Gaji & Honorarium',
  [COA.BEBAN_SEWA]: 'Beban Sewa',
  [COA.BEBAN_LISTRIK_AIR]: 'Beban Listrik & Air',
  [COA.BEBAN_TELEPON]: 'Beban Telepon & Internet',
  [COA.BEBAN_ATK]: 'Beban ATK & Perlengkapan',
  [COA.BEBAN_PENYUSUTAN]: 'Beban Penyusutan',
  [COA.BEBAN_ADMIN_BANK]: 'Beban Administrasi Bank',
  [COA.BEBAN_TRANSPORTASI]: 'Beban Transportasi',
  [COA.BEBAN_RAPAT_RAT]: 'Beban Rapat & RAT',
  [COA.BEBAN_PENDIDIKAN]: 'Beban Pendidikan & Pelatihan',
  [COA.BEBAN_BUNGA]: 'Beban Bunga',
  [COA.HPP]: 'Harga Pokok Penjualan',
  [COA.BEBAN_LAIN]: 'Beban Lain-lain',
}

/**
 * Helper untuk mendapatkan kode akun berdasarkan jenis simpanan
 */
export const getSavingsAccountCode = (type: 'pokok' | 'wajib' | 'sukarela'): string => {
  switch (type) {
    case 'pokok':
      return COA.SIMPANAN_POKOK
    case 'wajib':
      return COA.SIMPANAN_WAJIB
    case 'sukarela':
      return COA.SIMPANAN_SUKARELA
    default:
      return COA.SIMPANAN_SUKARELA
  }
}
