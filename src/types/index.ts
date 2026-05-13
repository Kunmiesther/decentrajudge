export type DisputeStatus = 'pending' | 'under_review' | 'resolved' | 'finalized' | 'cancelled'
export type VerdictType = 'claimant' | 'respondent' | 'split' | ''

// Matches contract's dispute_to_dict() output exactly
export interface Dispute {
  id: string
  job_title: string
  job_brief: string
  evidence_url: string
  resolution_criteria: string
  claimant: string
  respondent: string
  escrow_amount: string        // contract returns str(int(u256))
  status: DisputeStatus
  verdict: VerdictType
  verdict_reasoning: string    // contract field (not verdict_data)
  verdict_confidence: string   // "high" | "medium" | "low"
  evidence_summary: string
  created_at: string           // contract returns str(int(u256))
  resolved_at: string          // contract returns str(int(u256))
}

// Matches contract's get_platform_stats() output exactly
export interface PlatformStats {
  total_disputes: number
  resolved_count: number
  pending_count: number
  under_review_count: number
  total_escrowed_wei: string   // contract returns str(int)
}

export interface ValidatorCard {
  id: string
  verdict: 'IN FAVOUR' | 'DISPUTED' | 'ANALYZING...'
  reasoning: string
}