import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Batalhão Tático Especial',
  description: 'Site oficial do Batalhão Tático Especial para GTA Roleplay',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark" style={{ colorScheme: 'dark' }}>
      <body>{children}</body>
    </html>
  )
}
