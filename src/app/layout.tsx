import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { WalletProvider } from '@/hooks/useWallet'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['300', '400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'DecentraJudge — Trustless Dispute Resolution',
  description:
    'Submit work, escrow funds, and let decentralized AI validators decide — fairly. Sovereign Justice for the digital-first economy.',
  keywords: ['blockchain', 'dispute resolution', 'AI arbitration', 'GenLayer', 'Web3'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  )
}