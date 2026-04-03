/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '../../../payload.config'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './importMap.js'
import './custom.scss'

type Args = {
  children: React.ReactNode
}

export default RootLayout

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Admin | Koperasi Merah Putih',
    description: 'Panel Admin Koperasi Merah Putih',
  }
}
