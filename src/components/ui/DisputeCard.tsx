import Link from 'next/link'
import { ArrowUpRight, Lock } from 'lucide-react'
import { Dispute } from '@/types'
import StatusBadge from './StatusBadge'
import { shortAddress, fromWei } from '@/lib/genlayer'

export default function DisputeCard({ dispute }: { dispute: Dispute }) {
  return (
    <Link
      href={`/dispute/${dispute.id}`}
      className="block bg-surface border border-border rounded-xl p-5 hover:border-border-light hover:shadow-card-hover transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-text-tertiary">
            CASE #{dispute.claimant.slice(0, 8).toUpperCase()}...{dispute.id.padStart(2, '0')}
          </span>
          <StatusBadge status={dispute.status} size="sm" />
        </div>
        <ArrowUpRight className="w-4 h-4 text-text-tertiary group-hover:text-indigo transition-colors flex-shrink-0" />
      </div>

      <h3 className="font-semibold text-text-primary text-[15px] mb-2 line-clamp-1">
        {dispute.job_title}
      </h3>
      <p className="text-text-secondary text-sm line-clamp-2 mb-4">
        {dispute.job_brief}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-text-secondary text-xs">
          <Lock className="w-3 h-3" />
          <span className="font-mono">{fromWei(BigInt(Math.floor(dispute.escrow_amount)))} ETH</span>
          <span className="text-text-tertiary">escrowed</span>
        </div>
        <span className="font-mono text-xs text-text-tertiary">
          {shortAddress(dispute.claimant)}
        </span>
      </div>
    </Link>
  )
}