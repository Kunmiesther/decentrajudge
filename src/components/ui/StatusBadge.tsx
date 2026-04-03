import clsx from 'clsx'
import { DisputeStatus, VerdictType } from '@/types'

interface StatusBadgeProps {
  status?: DisputeStatus
  verdict?: VerdictType
  label?: string
  size?: 'sm' | 'md'
}

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  pending: { label: 'PENDING', classes: 'text-text-secondary bg-surface-2 border-border' },
  under_review: { label: 'UNDER REVIEW', classes: 'text-status-review bg-status-review-bg border-status-review/20' },
  resolved: { label: 'RESOLVED', classes: 'text-status-resolved bg-status-resolved-bg border-status-resolved/20' },
  finalized: { label: 'FINALIZED', classes: 'text-status-resolved bg-status-resolved-bg border-status-resolved/20' },
  cancelled: { label: 'CANCELLED', classes: 'text-text-tertiary bg-surface-2 border-border' },
  'IN FAVOUR': { label: 'IN FAVOUR', classes: 'text-status-favour bg-status-favour-bg border-status-favour/20' },
  DISPUTED: { label: 'DISPUTED', classes: 'text-status-disputed bg-status-disputed-bg border-status-disputed/20' },
  'ANALYZING...': { label: 'ANALYZING...', classes: 'text-indigo bg-indigo-subtle border-indigo/20' },
}

export default function StatusBadge({ status, verdict, label, size = 'md' }: StatusBadgeProps) {
  const key = label || status || ''
  const config = STATUS_CONFIG[key] || { label: key.toUpperCase(), classes: 'text-text-secondary bg-surface border-border' }

  return (
    <span
      className={clsx(
        'inline-flex items-center border rounded-md font-mono tracking-widest uppercase',
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1',
        config.classes
      )}
    >
      {config.label}
    </span>
  )
}