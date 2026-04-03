import fs from 'fs'
import path from 'path'

const collectionsDir = path.join(process.cwd(), 'src', 'collections')

const translations: Record<string, { singular: string, plural: string }> = {
  'Users': { singular: 'Pengguna', plural: 'Data Pengguna' },
  'Members': { singular: 'Anggota', plural: 'Data Anggota' },
  'Savings': { singular: 'Simpanan', plural: 'Data Simpanan' },
  'Loans': { singular: 'Pinjaman', plural: 'Data Pinjaman' },
  'Accounts': { singular: 'Akun Keuangan', plural: 'Bagan Akun' },
  'Ledger': { singular: 'Buku Besar', plural: 'Jurnal Umum' },
  'Products': { singular: 'Produk', plural: 'Katalog Produk' },
  'Transactions': { singular: 'Transaksi', plural: 'Histori Transaksi' },
  'Assets': { singular: 'Aset', plural: 'Daftar Inventaris' },
  'Logs': { singular: 'Kejadian', plural: 'Buku Kejadian Penting' },
  'GuestBook': { singular: 'Buku Tamu', plural: 'Daftar Buku Tamu' },
  'Meetings': { singular: 'Rapat', plural: 'Buku Notulen Rapat' },
  'Media': { singular: 'Media', plural: 'Galeri Media' },
  'BoardMembers': { singular: 'Pengurus', plural: 'Daftar Pengurus' },
  'Supervisors': { singular: 'Pengawas', plural: 'Daftar Pengawas' },
  'Employees': { singular: 'Karyawan', plural: 'Daftar Karyawan' },
  'MemberRegistry': { singular: 'Buku Induk', plural: 'Buku Induk Anggota' },
  'Suggestions': { singular: 'Saran', plural: 'Saran & Anjuran' },
  'MailLog': { singular: 'Surat', plural: 'Ekspedisi Surat' },
}

for (const [folder, labels] of Object.entries(translations)) {
  const filePath = path.join(collectionsDir, folder, 'index.ts')
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8')
    if (!content.includes('labels:')) {
      const labelBlock = `\n  labels: {\n    singular: '${labels.singular}',\n    plural: '${labels.plural}',\n  },`
      content = content.replace(/admin:\s*{/, `${labelBlock}\n  admin: {`)
      fs.writeFileSync(filePath, content)
      console.log(`Updated ${folder}`)
    }
  }
}
