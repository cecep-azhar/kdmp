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
  PIUTANG_PINJAMAN: '1-1003',       // Piutang Pinjaman
  PIUTANG_ANGGOTA: '1-1004',        // Piutang Anggota
  PERSEDIAAN: '1-1005',             // Persediaan Barang

  // Aset Tetap
  TANAH: '1-2001',                  // Tanah
  BANGUNAN: '1-2002',               // Bangunan
  KENDARAAN: '1-2003',              // Kendaraan
  INVENTARIS: '1-2004',             // Inventaris/Perlengkapan

  // Liabilitas / Kewajiban
  HUTANG_PINJAMAN: '2-1001',        // Hutang Pinjaman
  HUTANG_DAGANG: '2-1002',          // Hutang Dagang

  // Ekuitas / Modal
  MODAL_DISETOR: '3-1001',          // Modal Disetor
  SIMPANAN_POKOK: '3-2001',        // Simpanan Pokok Anggota
  SIMPANAN_WAJIB: '3-2002',        // Simpanan Wajib Anggota
  SIMPANAN_SUKARELA: '3-2003',     // Simpanan Sukarela Anggota
  CADANGAN_SHU: '3-3001',           // Cadangan SHU

  // Pendapatan
  PENDAPATAN_BUNGA_PINJAMAN: '4-1001', // Pendapatan Bunga Pinjaman
  PENDAPATAN_ADMIN_PINJAMAN: '4-1002', // Pendapatan Admin Pinjaman
  PENDAPATAN_DAGANG: '4-2001',         // Pendapatan Penjualan

  // Beban
  BEBAN_OPERASIONAL: '5-1001',     // Beban Operasional
  BEBAN_GAJIH: '5-1002',            // Beban Gaji
  BEBAN_LISTRIK_AIR: '5-1003',      // Beban Listrik & Air
  BEBAN_ADMINISTRASI: '5-1004',     // Beban Administrasi
} as const

export type COA_CODE = typeof COA[keyof typeof COA]

/**
 * Mapping nama akun ke kode untuk lookup
 */
export const COA_NAMES: Record<string, string> = {
  [COA.KAS]: 'Kas',
  [COA.BANK]: 'Bank',
  [COA.PIUTANG_PINJAMAN]: 'Piutang Pinjaman',
  [COA.PIUTANG_ANGGOTA]: 'Piutang Anggota',
  [COA.PERSEDIAAN]: 'Persediaan',
  [COA.TANAH]: 'Tanah',
  [COA.BANGUNAN]: 'Bangunan',
  [COA.KENDARAAN]: 'Kendaraan',
  [COA.INVENTARIS]: 'Inventaris',
  [COA.HUTANG_PINJAMAN]: 'Hutang Pinjaman',
  [COA.HUTANG_DAGANG]: 'Hutang Dagang',
  [COA.MODAL_DISETOR]: 'Modal Disetor',
  [COA.SIMPANAN_POKOK]: 'Simpanan Pokok',
  [COA.SIMPANAN_WAJIB]: 'Simpanan Wajib',
  [COA.SIMPANAN_SUKARELA]: 'Simpanan Sukarela',
  [COA.CADANGAN_SHU]: 'Cadangan SHU',
  [COA.PENDAPATAN_BUNGA_PINJAMAN]: 'Pendapatan Bunga Pinjaman',
  [COA.PENDAPATAN_ADMIN_PINJAMAN]: 'Pendapatan Admin Pinjaman',
  [COA.PENDAPATAN_DAGANG]: 'Pendapatan Penjualan',
  [COA.BEBAN_OPERASIONAL]: 'Beban Operasional',
  [COA.BEBAN_GAJIH]: 'Beban Gaji',
  [COA.BEBAN_LISTRIK_AIR]: 'Beban Listrik & Air',
  [COA.BEBAN_ADMINISTRASI]: 'Beban Administrasi',
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
