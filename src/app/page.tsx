import Link from 'next/link'
import { ArrowRight, CheckCircle, Clock, DollarSign, Shield, Users, Zap } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const FEATURES = [
  {
    icon: Shield,
    title: 'Decentralized Evidence Vault',
    description:
      'Your evidence is hashed on-chain and stored via IPFS, ensuring absolute integrity and permanent access for validators.',
    wide: true,
  },
  {
    icon: Shield,
    title: 'Immutable Escrow',
    description:
      'Smart contracts hold project funds. Release is only triggered by verifiable proof of work or validator consensus.',
    wide: false,
  },
  {
    icon: Users,
    title: 'AI Validator Jury',
    description:
      'A multi-model consensus layer cross-references contract terms with submitted deliverables for unbiased judgment.',
    wide: false,
  },
  {
    icon: Zap,
    title: 'Global Jurisdictional Neutrality',
    description:
      'Escape the constraints of local legal systems. Sovereign Justice operates in the digital cloud, accessible from anywhere.',
    wide: false,
    cta: { label: 'READ THE WHITEPAPER', href: '#' },
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* Background grid */}
          <div
            className="absolute inset-0 bg-grid-pattern bg-grid opacity-100"
            aria-hidden
          />
          {/* Radial glow */}
          <div
            className="absolute inset-0 bg-hero-glow"
            aria-hidden
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
            {/* Network pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-full text-xs font-mono text-text-secondary mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-status-resolved animate-pulse" />
              ARBITRUM ONE MAINNET LIVE
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-text-primary leading-[1.05] mb-6 max-w-4xl mx-auto">
              Trustless dispute
              <br />
              resolution,{' '}
              <span className="text-indigo">powered by AI.</span>
            </h1>

            <p className="text-text-secondary text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              Submit work, escrow funds, and let decentralized AI validators decide
              — fairly. Sovereign Justice for the digital-first economy.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/post-dispute" className="btn-primary text-base px-7 py-3.5 w-full sm:w-auto">
                Post a Dispute
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/browse" className="btn-secondary text-base px-7 py-3.5 w-full sm:w-auto">
                Browse Open Cases
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              value="14,208"
              label="TOTAL DISPUTES RESOLVED"
              icon={CheckCircle}
            />
            <StatCard
              value={<>4.2 <span className="text-2xl font-mono text-text-secondary">Hrs</span></>}
              label="AVERAGE RESOLUTION TIME"
              icon={Clock}
            />
            <StatCard
              value="$12.4M"
              label="TOTAL FUNDS ESCROWED"
              icon={DollarSign}
            />
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Wide feature card */}
            <div className="bg-surface border border-border rounded-2xl p-7 md:col-span-1 overflow-hidden relative">
              <h2 className="text-xl font-bold text-text-primary mb-3">
                Decentralized Evidence Vault
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed max-w-xs mb-6">
                Your evidence is hashed on-chain and stored via IPFS, ensuring absolute
                integrity and permanent access for validators.
              </p>
              {/* Decorative blockchain grid */}
              <div className="rounded-xl overflow-hidden border border-border h-36 bg-surface-2 flex items-center justify-center">
                <BlockchainDecoration />
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-7 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo/10 border border-indigo/20 flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-indigo" />
                </div>
                <h2 className="text-xl font-bold text-text-primary mb-2">Immutable Escrow</h2>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Smart contracts hold project funds. Release is only triggered by verifiable
                  proof of work or validator consensus.
                </p>
              </div>
              <div className="flex justify-end mt-6">
                <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center">
                  <Lock size={22} className="text-text-secondary" />
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-7 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo/10 border border-indigo/20 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-indigo" />
                </div>
                <h2 className="text-xl font-bold text-text-primary mb-2">AI Validator Jury</h2>
                <p className="text-text-secondary text-sm leading-relaxed">
                  A multi-model consensus layer cross-references contract terms with submitted
                  deliverables for unbiased judgment.
                </p>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-7 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="rounded-xl overflow-hidden border border-border h-36 w-full sm:w-40 bg-surface-2 flex-shrink-0 flex items-center justify-center">
                  <GlobeDecoration />
                </div>
                <div className="flex-1 flex flex-col justify-between h-full">
                  <div>
                    <h2 className="text-xl font-bold text-text-primary mb-2">
                      Global Jurisdictional Neutrality
                    </h2>
                    <p className="text-text-secondary text-sm leading-relaxed mb-4">
                      Escape the constraints of local legal systems. Sovereign Justice operates
                      in the digital cloud, accessible from anywhere.
                    </p>
                  </div>
                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest text-text-secondary hover:text-indigo transition-colors uppercase"
                  >
                    Read the Whitepaper
                    <ArrowRight className="w-3 h-3" />
                  </a>
                  <p className="text-xs font-mono text-text-tertiary uppercase tracking-widest mt-2">
                    Safe Work
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function StatCard({
  value,
  label,
  icon: Icon,
}: {
  value: React.ReactNode
  label: string
  icon: any
}) {
  return (
    <div className="stat-card">
      <div>
        <div className="text-3xl font-bold text-text-primary font-mono mb-1">{value}</div>
        <div className="text-xs font-mono tracking-widest text-text-tertiary uppercase">{label}</div>
      </div>
      <Icon className="w-8 h-8 text-text-muted" strokeWidth={1} />
    </div>
  )
}

function BlockchainDecoration() {
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      <div className="grid grid-cols-6 gap-2 opacity-30">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="w-8 h-6 rounded border border-indigo/40 bg-indigo/5 flex items-center justify-center"
          >
            <div className="w-2 h-px bg-indigo/60" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-surface-2 via-transparent to-surface-2" />
      <span className="absolute font-mono text-xs tracking-widest text-text-tertiary uppercase">
        Blockchain
      </span>
    </div>
  )
}

function GlobeDecoration() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-20 h-20">
        <div className="w-20 h-20 rounded-full border border-indigo/30 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border border-indigo/20 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-indigo/30 border border-indigo/50" />
          </div>
        </div>
        {/* Orbit lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-px bg-indigo/10" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-px h-20 bg-indigo/10" />
        </div>
      </div>
    </div>
  )
}

// Needed for inline use
function Lock({ size, className }: { size: number; className: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}