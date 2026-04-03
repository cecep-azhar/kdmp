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
                  defaultValue: '#4f46e5', // Indigo 600 as default
                  admin: {
                    description: 'Contoh: #4f46e5',
                  },
                },
                {
                  name: 'accentColor',
                  type: 'text',
                  label: 'Warna Aksen (Accent/Hex)',
                  required: true,
                  defaultValue: '#10b981', // Emerald 500 as default
                  admin: {
                    description: 'Contoh: #10b981',
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
                  defaultValue: '#6366f1', // Indigo 500 as default
                  admin: {
                    description: 'Contoh: #6366f1',
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
