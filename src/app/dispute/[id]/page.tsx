'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, Folder, ExternalLink, CheckCircle } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StatusBadge from '@/components/ui/StatusBadge'
import { useDispute, useFinalizeVerdict } from '@/hooks/useDisputes'
import { shortAddress, fromWei, generateValidatorPanel } from '@/lib/genlayer'
import clsx from 'clsx'

interface Props {
  params: Promise<{ id: string }>
}

export default function DisputeDetailPage({ params }: Props) {
  const { id } = use(params)
  const { dispute, loading } = useDispute(id)
  const { finalizeVerdict, finalizing } = useFinalizeVerdict()

  if (loading) return <LoadingSkeleton />
  if (!dispute) return <NotFound />

  const escrowEth = fromWei(BigInt(Math.floor(dispute.escrow_amount)))
  const caseId = `#0X${dispute.claimant.slice(2, 7).toUpperCase()}...${dispute.id.padStart(2, '0').toUpperCase()}E`

  const validators = dispute.verdict_data && dispute.verdict_data.verdict
    ? generateValidatorPanel({
        verdict: dispute.verdict_data.verdict,
        reasoning: dispute.verdict_data.reasoning,
        confidence: dispute.verdict_data.confidence,
      })
    : [
        { id: 'VALIDATOR #0032', verdict: 'IN FAVOUR', reasoning: 'Milestone artifacts align with the primary contract. Coverage discrepancy is within the margin of error (±2%).' },
        { id: 'VALIDATOR #0081', verdict: 'DISPUTED', reasoning: 'Critical security flag in liquidity_pool.sol (Line 144) violates the "Production Ready" requirement.' },
        { id: 'VALIDATOR #0114', verdict: 'IN FAVOUR', reasoning: 'UI deliverables meet all Figma specifications. Security concern is identified as a false positive by secondary analysis.' },
        { id: 'VALIDATOR #0027', verdict: 'IN FAVOUR', reasoning: 'Technical annex ambiguity favors the executor in this instance. Code quality exceeds median protocol standards.' },
        { id: 'VALIDATOR #0099', verdict: 'ANALYZING...', reasoning: '' },
      ]

  const inFavour = validators.filter((v) => v.verdict === 'IN FAVOUR').length
  const total = validators.filter((v) => v.verdict !== 'ANALYZING...').length || 5
  const isResolved = dispute.status === 'resolved' || dispute.status === 'finalized'

  const currentLean =
    inFavour >= 3 ? 'Claimant Overwhelming' : inFavour === 2 ? 'Contested' : 'Respondent Favoured'

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

          {/* Back */}
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 text-text-secondary text-sm hover:text-text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Browse
          </Link>

          {/* Case Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="font-mono text-xs text-indigo font-medium">CASE {caseId}</span>
                <StatusBadge status={dispute.status} />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary leading-tight mb-3">
                {dispute.job_title}
              </h1>
              <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">
                {dispute.job_brief.slice(0, 180)}
                {dispute.job_brief.length > 180 ? '...' : ''}
              </p>
            </div>

            <div className="sm:text-right flex-shrink-0">
              <p className="text-xs font-mono tracking-widest text-text-tertiary uppercase mb-1">
                Escrowed Amount
              </p>
              <p className="text-4xl font-extrabold text-text-primary font-mono">
                {escrowEth} <span className="text-2xl font-bold">ETH</span>
              </p>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Left: Brief + Evidence */}
            <div className="flex-1 space-y-5">
              {/* Case Brief */}
              <div className="bg-surface border border-border rounded-2xl p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <FileText className="w-4 h-4 text-text-secondary" />
                  <h2 className="font-semibold text-text-primary">Case Brief</h2>
                </div>
                <div className="text-text-secondary text-sm leading-relaxed space-y-3">
                  {dispute.job_brief.split('\n').filter(Boolean).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              {/* Evidence Locker */}
              <div className="bg-surface border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <Folder className="w-4 h-4 text-text-secondary" />
                    <h2 className="font-semibold text-text-primary">Evidence Locker</h2>
                  </div>
                  <span className="text-xs font-mono text-text-tertiary">4 ITEMS UPLOADED</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <EvidenceItem
                    icon="file"
                    name="PR #421: DEX Core"
                    type="GITHUB REPOSITORY"
                    href={dispute.evidence_url}
                  />
                  <EvidenceItem
                    icon="shield"
                    name="Coverage_Report.html"
                    type="ARTIFACT"
                    href="#"
                  />
                </div>
              </div>
            </div>

            {/* Right: Validator Panel */}
            <div className="lg:w-[420px]">
              <div className="bg-surface border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo/10 border border-indigo/20 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-indigo" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h2 className="font-semibold text-text-primary">AI Validator Panel</h2>
                  </div>
                  <span className="text-xs font-mono bg-surface-2 border border-border text-text-tertiary px-2.5 py-1 rounded-md">
                    QUORUM REQ: 3/5
                  </span>
                </div>

                <div className="space-y-3">
                  {validators.map((v, i) => (
                    <ValidatorCard key={i} validator={v} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Consensus */}
          <div className="mt-6 bg-surface border border-border rounded-2xl px-6 py-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div>
                  <p className="text-xs font-mono tracking-widest text-text-tertiary uppercase mb-1">
                    Consensus Progress
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold font-mono text-text-primary">
                      {inFavour} / {total}
                    </span>
                    <ConsensusBar value={inFavour} total={total} />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-mono tracking-widest text-text-tertiary uppercase mb-1">
                    Current Lean
                  </p>
                  <p className="font-semibold text-text-primary text-sm">{currentLean}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button className="btn-secondary text-sm py-2.5 px-4 flex-1 sm:flex-initial">
                  Add Observation
                </button>
                <button
                  onClick={() => finalizeVerdict(dispute.id)}
                  disabled={!isResolved || finalizing}
                  className={clsx(
                    'btn-primary text-sm py-2.5 px-5 flex-1 sm:flex-initial',
                    (!isResolved || finalizing) && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <CheckCircle className="w-4 h-4" />
                  {finalizing ? 'Finalizing...' : 'Finalize Verdict'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function ValidatorCard({ validator }: { validator: { id: string; verdict: string; reasoning: string } }) {
  const isAnalyzing = validator.verdict === 'ANALYZING...'
  const isFavour = validator.verdict === 'IN FAVOUR'
  const isDisputed = validator.verdict === 'DISPUTED'

  return (
    <div className="validator-card">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs text-text-tertiary tracking-wider">{validator.id}</span>
        <StatusBadge label={validator.verdict} size="sm" />
      </div>
      {isAnalyzing ? (
        <div className="mt-2">
          <div className="h-1 bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-indigo rounded-full animate-analyzing" style={{ width: '60%' }} />
          </div>
        </div>
      ) : (
        <p className="text-text-secondary text-xs leading-relaxed">{validator.reasoning}</p>
      )}
    </div>
  )
}

function EvidenceItem({
  icon,
  name,
  type,
  href,
}: {
  icon: 'file' | 'shield'
  name: string
  type: string
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 bg-surface-2 border border-border rounded-xl p-4 hover:border-border-light transition-colors group"
    >
      <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center flex-shrink-0">
        {icon === 'file' ? (
          <FileText className="w-4 h-4 text-text-secondary" />
        ) : (
          <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-text-primary text-sm font-medium truncate group-hover:text-indigo transition-colors">{name}</p>
        <p className="text-text-tertiary text-xs font-mono tracking-wider">{type}</p>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-text-tertiary group-hover:text-indigo transition-colors flex-shrink-0" />
    </a>
  )
}

function ConsensusBar({ value, total }: { value: number; total: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            'h-1.5 w-6 rounded-full transition-all',
            i < value ? 'bg-indigo' : 'bg-border'
          )}
        />
      ))}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-24 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="h-8 w-32 shimmer rounded-lg mb-8" />
        <div className="h-12 w-2/3 shimmer rounded-xl mb-4" />
        <div className="h-5 w-full shimmer rounded-lg mb-2" />
        <div className="h-5 w-3/4 shimmer rounded-lg mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 shimmer rounded-2xl" />
          <div className="h-80 shimmer rounded-2xl" />
        </div>
      </main>
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Dispute not found</h2>
          <p className="text-text-secondary mb-6">This case ID doesn't exist or has been removed.</p>
          <Link href="/browse" className="btn-primary inline-flex">
            <ArrowLeft className="w-4 h-4" />
            Back to Browse
          </Link>
        </div>
      </main>
    </div>
  )
}