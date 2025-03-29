// Este archivo forma parte del  directorio de la aplicación Next.js.
'use client'


// Importaciones de React y Next.js Themes
import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'


// Componente de Proveedor de Temas para la Aplicación
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}