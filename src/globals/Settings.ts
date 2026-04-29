import { GlobalConfig } from 'payload'
import { isStaffOrAbove } from '../access'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Pengaturan',
  admin: {
    group: 'Pengaturan Sistem',
  },
  access: {
    read: () => true,
    update: isStaffOrAbove,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Branding',
          fields: [
            {
              name: 'appName',
              type: 'text',
              label: 'Nama Aplikasi',
              required: true,
              defaultValue: 'SIKDMP Sistem Informasi Kopi Desa Merah Putih',
            },
            {
              name: 'appLogo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo Aplikasi',
              admin: {
                description: 'Idealnya rasio 1:1 atau SVG dengan background transparan',
              },
            },
            {
              name: 'defaultLanguage',
              type: 'select',
              label: 'Bahasa Default',
              required: true,
              defaultValue: 'id',
              options: [
                {
                  label: 'Bahasa Indonesia',
                  value: 'id',
                },
                {
                  label: 'English',
                  value: 'en',
                },
              ],
            },
          ],
        },
        {
          label: 'Tema & Warna',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'primaryColor',
                  type: 'text',
                  label: 'Warna Utama (Primary/Hex)',
                  required: true,
                  defaultValue: '#DC2626', // Merah (Red 600) - Warna Koprasi Merah Putih
                  admin: {
                    description: 'Contoh: #DC2626',
                  },
                },
                {
                  name: 'accentColor',
                  type: 'text',
                  label: 'Warna Aksen (Accent/Hex)',
                  required: true,
                  defaultValue: '#FFFFFF', // Putih - Warna Koprasi Merah Putih
                  admin: {
                    description: 'Contoh: #FFFFFF atau #F59E0B untuk gold',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'darkModePrimary',
                  type: 'text',
                  label: 'Warna Utama (Mode Gelap/Hex)',
                  required: true,
                  defaultValue: '#EF4444', // Merah (Red 500) untuk dark mode
                  admin: {
                    description: 'Contoh: #EF4444',
                  },
                },
              ]
            }
          ],
        },
        // BUG FIX #11: Add Konfigurasi Pinjaman tab
        {
          label: 'Konfigurasi Pinjaman',
          fields: [
            {
              name: 'loanSettings',
              type: 'group',
              label: 'Pengaturan Pinjaman',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'defaultInterestRate',
                      type: 'number',
                      label: 'Suku Bunga Default (%/tahun)',
                      defaultValue: 12,
                      min: 0,
                      max: 100,
                      admin: {
                        description: 'Default 12% per tahun',
                      },
                    },
                    {
                      name: 'minLoanAmount',
                      type: 'number',
                      label: 'Minimum Pinjaman (Rp)',
                      defaultValue: 500000,
                      min: 0,
                      admin: {
                        description: 'Minimum Rp 500.000',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'maxLoanAmount',
                      type: 'number',
                      label: 'Maximum Pinjaman (Rp)',
                      defaultValue: 50000000,
                      min: 0,
                      admin: {
                        description: 'Maximum Rp 50.000.000',
                      },
                    },
                    {
                      name: 'maxTenorMonths',
                      type: 'number',
                      label: 'Maksimum Tenor (bulan)',
                      defaultValue: 60,
                      min: 1,
                      max: 120,
                      admin: {
                        description: 'Default 60 bulan',
                      },
                    },
                  ],
                },
                {
                  name: 'latePenaltyPerDay',
                  type: 'number',
                  label: 'Denda Keterlambatan (%/hari)',
                  defaultValue: 0.5,
                  min: 0,
                  admin: {
                    description: 'Denda per hari keterlambatan angsuran (default 0.5%)',
                  },
                },
              ],
            },
          ],
        },
        // FITUR #1: Add Konfigurasi SHU tab
        {
          label: 'Konfigurasi SHU',
          fields: [
            {
              name: 'shuSettings',
              type: 'group',
              label: 'Pengaturan SHU (Sisa Hasil Usaha)',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'reserveRatio',
                      type: 'number',
                      label: 'Cadangan SHU (%)',
                      defaultValue: 20,
                      min: 0,
                      max: 100,
                      admin: {
                        description: 'Minimal 20% sesuai UU Koprasi',
                      },
                    },
                    {
                      name: 'jasaModalRatio',
                      type: 'number',
                      label: 'Jasa Modal (%)',
                      defaultValue: 50,
                      min: 0,
                      max: 100,
                      admin: {
                        description: 'Proporsi untuk Jasa Modal',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'jasaAnggotaRatio',
                      type: 'number',
                      label: 'Jasa Anggota (%)',
                      defaultValue: 50,
                      min: 0,
                      max: 100,
                      admin: {
                        description: 'Proporsi untuk Jasa Anggota',
                      },
                    },
                    {
                      name: 'fiscalYear',
                      type: 'number',
                      label: 'Tahun Buku Berjalan',
                      defaultValue: () => new Date().getFullYear(),
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}