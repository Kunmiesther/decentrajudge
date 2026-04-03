export type DisputeStatus = 'pending' | 'under_review' | 'resolved' | 'finalized' | 'cancelled'
export type VerdictType = 'claimant' | 'respondent' | 'split' | null

export interface VerdictData {
  verdict: VerdictType
  confidence: number
  reasoning: string
  key_finding: string
  criteria_met: boolean
  notable_gaps: string | null
}

export interface Dispute {
  id: string
  job_title: string
  job_brief: string
  evidence_url: string
  resolution_criteria: string
  claimant: string
  respondent: string
  escrow_amount: number
  status: DisputeStatus
  verdict: VerdictType
  verdict_data?: VerdictData
  evidence_summary?: string
  validator_notes: string[]
  created_at: number
  resolved_at: number | null
}

export interface PlatformStats {
  total_disputes: number
  resolved_count: number
  pending_count: number
  under_review_count: number
  total_escrowed_wei: number
}

export interface ValidatorCard {
  id: string
  verdict: 'IN FAVOUR' | 'DISPUTED' | 'ANALYZING...'
  reasoning: string
}