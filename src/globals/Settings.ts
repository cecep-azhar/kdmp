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
              defaultValue: 'SIKDMP Sistem Informasi Koperasi Desa Merah Putih',
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
                  defaultValue: '#DC2626', // Merah (Red 600) - Warna Koperasi Merah Putih
                  admin: {
                    description: 'Contoh: #DC2626',
                  },
                },
                {
                  name: 'accentColor',
                  type: 'text',
                  label: 'Warna Aksen (Accent/Hex)',
                  required: true,
                  defaultValue: '#FFFFFF', // Putih - Warna Koperasi Merah Putih
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
      ],
    },
  ],
}
