'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, Plus } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import DisputeCard from '@/components/ui/DisputeCard'
import { useDisputes } from '@/hooks/useDisputes'
import type { DisputeStatus } from '@/types'
import clsx from 'clsx'

const STATUS_FILTERS: { label: string; value: DisputeStatus | 'all' }[] = [
  { label: 'All Cases', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Finalized', value: 'finalized' },
]

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Highest Escrow', value: 'escrow_desc' },
  { label: 'Lowest Escrow', value: 'escrow_asc' },
]

export default function BrowsePage() {
  const { disputes, stats, loading, error, refetch } = useDisputes()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | 'all'>('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showSort, setShowSort] = useState(false)

  const filtered = useMemo(() => {
    let list = [...disputes]

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (d) =>
          d.job_title.toLowerCase().includes(q) ||
          d.job_brief.toLowerCase().includes(q) ||
          d.claimant.toLowerCase().includes(q) ||
          d.id.includes(q)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      list = list.filter((d) => d.status === statusFilter)
    }

    // Sort
    if (sortBy === 'newest') {
      list.sort((a, b) => b.created_at - a.created_at)
    } else if (sortBy === 'escrow_desc') {
      list.sort((a, b) => b.escrow_amount - a.escrow_amount)
    } else if (sortBy === 'escrow_asc') {
      list.sort((a, b) => a.escrow_amount - b.escrow_amount)
    }

    return list
  }, [disputes, search, statusFilter, sortBy])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-extrabold text-text-primary mb-2">Browse Disputes</h1>
              <p className="text-text-secondary text-sm">
                {stats
                  ? `${stats.total_disputes.toLocaleString()} total cases · ${stats.under_review_count} under review`
                  : 'Loading platform data...'}
              </p>
            </div>
            <Link href="/post-dispute" className="btn-primary text-sm py-2.5 px-5 self-start sm:self-auto">
              <Plus className="w-4 h-4" />
              Open New Case
            </Link>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, brief, or address..."
                className="input-field pl-11 w-full"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="btn-secondary text-sm py-2.5 px-4 gap-2 h-full"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}
              </button>
              {showSort && (
                <div className="absolute right-0 mt-2 w-44 bg-surface border border-border rounded-xl shadow-card z-10 overflow-hidden">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setShowSort(false) }}
                      className={clsx(
                        'w-full text-left px-4 py-3 text-sm transition-colors',
                        sortBy === opt.value
                          ? 'text-indigo bg-indigo-subtle'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status filter pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={clsx(
                  'px-4 py-1.5 rounded-full text-xs font-mono tracking-wider border transition-all',
                  statusFilter === f.value
                    ? 'bg-indigo text-white border-indigo'
                    : 'bg-transparent border-border text-text-secondary hover:border-border-light hover:text-text-primary'
                )}
              >
                {f.label}
                {f.value !== 'all' && (
                  <span className="ml-1.5 opacity-60">
                    ({disputes.filter((d) => d.status === f.value).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Error banner */}
          {error && (
            <div className="bg-status-disputed-bg border border-status-disputed/20 rounded-xl px-4 py-3 text-status-disputed text-sm mb-6 flex items-center justify-between">
              <span>Could not connect to contract: using demo data. {error}</span>
              <button onClick={refetch} className="text-xs underline ml-4">Retry</button>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <LoadingGrid />
          ) : filtered.length === 0 ? (
            <EmptyState hasSearch={!!search || statusFilter !== 'all'} />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                {filtered.map((dispute) => (
                  <DisputeCard key={dispute.id} dispute={dispute} />
                ))}
              </div>
              <p className="text-center text-xs font-mono text-text-tertiary">
                Showing {filtered.length} of {disputes.length} cases
              </p>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-surface border border-border rounded-xl p-5 space-y-3">
          <div className="flex gap-2">
            <div className="h-4 w-28 shimmer rounded" />
            <div className="h-4 w-20 shimmer rounded" />
          </div>
          <div className="h-5 w-3/4 shimmer rounded" />
          <div className="h-4 w-full shimmer rounded" />
          <div className="h-4 w-2/3 shimmer rounded" />
          <div className="h-px bg-border my-2" />
          <div className="flex justify-between">
            <div className="h-3 w-24 shimmer rounded" />
            <div className="h-3 w-20 shimmer rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="text-center py-24">
      <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-5">
        <Search className="w-6 h-6 text-text-tertiary" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {hasSearch ? 'No cases match your search' : 'No cases yet'}
      </h3>
      <p className="text-text-secondary text-sm mb-6">
        {hasSearch
          ? 'Try adjusting your search or filters.'
          : 'Be the first to open a dispute on DecentraJudge.'}
      </p>
      {!hasSearch && (
        <Link href="/post-dispute" className="btn-primary inline-flex text-sm">
          <Plus className="w-4 h-4" />
          Open First Case
        </Link>
      )}
    </div>
  )
}