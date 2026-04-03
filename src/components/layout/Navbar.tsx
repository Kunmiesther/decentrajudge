'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Scale, Wallet, LogOut, ChevronDown } from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { shortAddress } from '@/lib/genlayer'
import { useState } from 'react'
import clsx from 'clsx'

const NAV_LINKS = [
  { href: '/', label: 'Dashboard' },
  { href: '/browse', label: 'Browse Disputes' },
  { href: '/how-it-works', label: 'How It Works' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { address, isConnecting, isConnected, connect, disconnect } = useWallet()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo/20 border border-indigo/30 flex items-center justify-center group-hover:bg-indigo/30 transition-colors">
              <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo" />
            </div>
            <span className="font-bold text-text-primary text-[14px] sm:text-[15px] tracking-tight">
              DecentraJudge
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                    active
                      ? 'text-text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                  )}
                >
                  {link.label}
                  {active && (
                    <div className="h-px bg-indigo mt-0.5 mx-auto w-4/5 rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right side: wallet + hamburger */}
          <div className="flex items-center gap-2">
            {isConnected && address ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-surface border border-border rounded-xl text-sm font-medium text-text-primary hover:border-border-light transition-all"
                >
                  <div className="w-2 h-2 rounded-full bg-status-resolved animate-pulse flex-shrink-0" />
                  <span className="font-mono text-xs hidden xs:block sm:block">{shortAddress(address)}</span>
                  <ChevronDown className={clsx('w-3 h-3 text-text-secondary transition-transform flex-shrink-0', menuOpen && 'rotate-180')} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-surface border border-border rounded-xl shadow-card overflow-hidden z-50">
                    <div className="px-4 py-2.5 border-b border-border">
                      <p className="font-mono text-xs text-text-tertiary truncate">{address}</p>
                    </div>
                    <button
                      onClick={() => { disconnect(); setMenuOpen(false) }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="flex items-center gap-1.5 bg-indigo hover:bg-indigo-dim text-white font-semibold px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl transition-all duration-150 text-sm disabled:opacity-50"
              >
                <Wallet className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </span>
                <span className="sm:hidden text-xs">
                  {isConnecting ? '...' : 'Connect'}
                </span>
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1.5 text-text-secondary hover:text-text-primary"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-5 flex flex-col gap-[5px]">
                <span className={clsx('block h-px bg-current transition-all duration-200 origin-center', mobileOpen ? 'rotate-45 translate-y-[6px]' : '')} />
                <span className={clsx('block h-px bg-current transition-all duration-200', mobileOpen ? 'opacity-0' : '')} />
                <span className={clsx('block h-px bg-current transition-all duration-200 origin-center', mobileOpen ? '-rotate-45 -translate-y-[6px]' : '')} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-2 space-y-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-text-primary bg-indigo/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}