import './globals.css'
import { Inter } from 'next/font/google'
import ProvidersWrapper from './ProvidersWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
        <body className={inter.className}>
          <ProvidersWrapper>
            {children}
          </ProvidersWrapper>
        </body>
      </html>
  )
}
