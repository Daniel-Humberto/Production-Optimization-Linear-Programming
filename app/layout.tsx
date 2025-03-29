// Este es un archivo de diseño Next.js que establece el diseño global de la aplicación.
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })


// Definicion de Metadatos globales de la aplicación.
export const metadata: Metadata = {
  title: "Dashboard de Optimización de Semiconductores",
  description: "Dashboard para optimización de producción de semiconductores mediante programación lineal",
  authors: [{ name: "Daniel Humberto Reyes Rocha" }]
}


// Definir el componente principal para el diseño global de la aplicación.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}


// Importar estilos globales
import './globals.css'