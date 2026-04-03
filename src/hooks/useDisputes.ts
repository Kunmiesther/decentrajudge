'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Dispute, PlatformStats } from '@/types'
import {
  fetchAllDisputes,
  fetchDispute,
  fetchPlatformStats,
  fetchDisputesByParty,
  txCreateDispute,
  txEvaluateDispute,
  txFinalizeVerdict,
  txCancelDispute,
  waitForTx,
  toWei,
  CONTRACT_ADDRESS,
} from '@/lib/genlayer'

// ─── Mock data (used when contract address is not yet set) ────────────────────
const CONTRACT_NOT_DEPLOYED = CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000'

const MOCK_DISPUTES: Dispute[] = [
  {
    id: '0',
    job_title: 'Full-Stack Development: Decentralized Exchange',
    job_brief:
      'The claimant (Developer) asserts that all items defined in the Phase 3 milestone—specifically the smart contract auditing bridge and the frontend swap interface—have been delivered according to the specification document dated 2024-03-12.\n\nThe respondent (Client) disputes the payment, citing that the unit tests for the liquidity pool contracts do not meet the 95% coverage threshold agreed upon in the technical annex. Additionally, a critical vulnerability was flagged by a third-party automated tool.',
    evidence_url: 'https://github.com/example/dex-core/pull/421',
    resolution_criteria:
      'Work is complete if: (1) All Phase 3 milestones are delivered, (2) Test coverage meets or exceeds 95%, (3) No critical security vulnerabilities exist in audited contracts.',
    claimant: '0xf4a9b2c1d3e5f6a7b8c9d0e1f2a3b4c5d6e7f821',
    respondent: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a921',
    escrow_amount: 12500000000000000000,
    status: 'under_review',
    verdict: null,
    validator_notes: [],
    created_at: Date.now() - 86400000,
    resolved_at: null,
  },
  {
    id: '1',
    job_title: 'Smart Contract Audit: Lending Protocol',
    job_brief:
      'Security audit of a DeFi lending protocol. Auditor claims all 47 items from the scope document have been reviewed and a full report delivered. Client disputes completeness of the audit report, citing three missing sections.',
    evidence_url: 'https://github.com/example/lending-audit',
    resolution_criteria:
      'Audit is complete when all scoped contracts are reviewed and a report is delivered with findings categorized by severity.',
    claimant: '0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b021',
    respondent: '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c121',
    escrow_amount: 8000000000000000000,
    status: 'resolved',
    verdict: 'claimant',
    verdict_data: {
      verdict: 'claimant',
      confidence: 0.87,
      reasoning:
        'Evidence confirms all 47 scoped items were reviewed. The report is comprehensive and follows industry-standard categorization. Minor formatting issues do not constitute incomplete delivery.',
      key_finding:
        'Audit report covers all scoped contracts with appropriate severity classifications.',
      criteria_met: true,
      notable_gaps: null,
    },
    validator_notes: [],
    created_at: Date.now() - 172800000,
    resolved_at: Date.now() - 43200000,
  },
  {
    id: '2',
    job_title: 'UI/UX Design: NFT Marketplace',
    job_brief:
      'Designer contracted to deliver 12 screens in Figma for an NFT marketplace. Designer claims all screens are delivered. Client claims 3 screens are missing and the design system is incomplete.',
    evidence_url: 'https://figma.com/example/nft-marketplace',
    resolution_criteria:
      'Design is complete when all 12 agreed screens are delivered in Figma with a complete component library and design tokens.',
    claimant: '0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d221',
    respondent: '0xe5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e321',
    escrow_amount: 3200000000000000000,
    status: 'pending',
    verdict: null,
    validator_notes: [],
    created_at: Date.now() - 3600000,
    resolved_at: null,
  },
  {
    id: '3',
    job_title: 'Backend API: Real-time Analytics Dashboard',
    job_brief:
      'Developer was hired to build a Node.js REST API with WebSocket support for real-time data streaming. Client disputes that the WebSocket implementation is incomplete and causes memory leaks under load.',
    evidence_url: 'https://github.com/example/analytics-api',
    resolution_criteria:
      'API is complete when all documented endpoints are functional, WebSocket streams without memory leaks, and load tests pass at 1000 concurrent connections.',
    claimant: '0xf6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f421',
    respondent: '0xa7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a521',
    escrow_amount: 5500000000000000000,
    status: 'pending',
    verdict: null,
    validator_notes: [],
    created_at: Date.now() - 7200000,
    resolved_at: null,
  },
]

const MOCK_STATS: PlatformStats = {
  total_disputes: 14208,
  resolved_count: 13891,
  pending_count: 201,
  under_review_count: 116,
  total_escrowed_wei: 12400000000000000000000000,
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useDisputes() {
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (CONTRACT_NOT_DEPLOYED) {
        // Dev mode: use mock data
        await new Promise((r) => setTimeout(r, 500))
        setDisputes(MOCK_DISPUTES)
        setStats(MOCK_STATS)
      } else {
        const [disputeList, platformStats] = await Promise.all([
          fetchAllDisputes(),
          fetchPlatformStats(),
        ])
        setDisputes(disputeList)
        setStats(platformStats)
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load disputes from contract')
      // Fallback to mock on error so UI doesn't break during dev
      setDisputes(MOCK_DISPUTES)
      setStats(MOCK_STATS)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { disputes, stats, loading, error, refetch: fetchData }
}

export function useDispute(id: string) {
  const [dispute, setDispute] = useState<Dispute | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        if (CONTRACT_NOT_DEPLOYED) {
          await new Promise((r) => setTimeout(r, 300))
          setDispute(MOCK_DISPUTES.find((d) => d.id === id) || null)
        } else {
          const d = await fetchDispute(id)
          setDispute(d)
        }
      } catch (e: any) {
        setError(e?.message || 'Dispute not found')
        setDispute(MOCK_DISPUTES.find((d) => d.id === id) || null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  return { dispute, loading, error }
}

export function useMyDisputes(address: string | null) {
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!address) return
    const load = async () => {
      setLoading(true)
      try {
        if (CONTRACT_NOT_DEPLOYED) {
          await new Promise((r) => setTimeout(r, 300))
          setDisputes(MOCK_DISPUTES.filter((d) => d.claimant === address || d.respondent === address))
        } else {
          setDisputes(await fetchDisputesByParty(address))
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [address])

  return { disputes, loading }
}

export function useCreateDispute() {
  const [submitting, setSubmitting] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const createDispute = useCallback(
    async (params: {
      jobTitle: string
      jobBrief: string
      evidenceUrl: string
      resolutionCriteria: string
      respondentAddress: string
      escrowAmountEth: string
      senderAddress: string
    }) => {
      setSubmitting(true)
      setError(null)
      setTxHash(null)
      try {
        if (CONTRACT_NOT_DEPLOYED) {
          // Simulate tx in dev mode
          await new Promise((r) => setTimeout(r, 1500))
          const fakeTx = '0x' + Math.random().toString(16).slice(2).padEnd(64, '0')
          setTxHash(fakeTx)
          return true
        }

        const hash = await txCreateDispute({
          jobTitle: params.jobTitle,
          jobBrief: params.jobBrief,
          evidenceUrl: params.evidenceUrl,
          resolutionCriteria: params.resolutionCriteria,
          respondentAddress: params.respondentAddress,
          escrowWei: toWei(params.escrowAmountEth),
          senderAddress: params.senderAddress,
        })
        setTxHash(hash)
        // Wait for confirmation
        await waitForTx(hash)
        return true
      } catch (e: any) {
        setError(e?.message || 'Transaction failed. Check your wallet and try again.')
        return false
      } finally {
        setSubmitting(false)
      }
    },
    []
  )

  return { createDispute, submitting, txHash, error }
}

export function useEvaluateDispute() {
  const [evaluating, setEvaluating] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const evaluateDispute = useCallback(async (disputeId: string) => {
    setEvaluating(true)
    setError(null)
    try {
      if (CONTRACT_NOT_DEPLOYED) {
        await new Promise((r) => setTimeout(r, 2000))
        setTxHash('0x' + Math.random().toString(16).slice(2).padEnd(64, '0'))
        return true
      }
      const hash = await txEvaluateDispute(disputeId)
      setTxHash(hash)
      await waitForTx(hash)
      return true
    } catch (e: any) {
      setError(e?.message || 'Evaluation failed')
      return false
    } finally {
      setEvaluating(false)
    }
  }, [])

  return { evaluateDispute, evaluating, txHash, error }
}

export function useFinalizeVerdict() {
  const [finalizing, setFinalizing] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const finalizeVerdict = useCallback(async (disputeId: string, senderAddress?: string) => {
    setFinalizing(true)
    setError(null)
    try {
      if (CONTRACT_NOT_DEPLOYED || !senderAddress) {
        await new Promise((r) => setTimeout(r, 1200))
        setTxHash('0x' + Math.random().toString(16).slice(2).padEnd(64, '0'))
        return true
      }
      const hash = await txFinalizeVerdict(disputeId)
      setTxHash(hash)
      await waitForTx(hash)
      return true
    } catch (e: any) {
      setError(e?.message || 'Finalization failed')
      return false
    } finally {
      setFinalizing(false)
    }
  }, [])

  return { finalizeVerdict, finalizing, txHash, error }
}

export function useCancelDispute() {
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cancelDispute = useCallback(async (disputeId: string, senderAddress: string) => {
    setCancelling(true)
    setError(null)
    try {
      if (CONTRACT_NOT_DEPLOYED) {
        await new Promise((r) => setTimeout(r, 1000))
        return true
      }
      const hash = await txCancelDispute(disputeId)
      await waitForTx(hash)
      return true
    } catch (e: any) {
      setError(e?.message || 'Cancellation failed')
      return false
    } finally {
      setCancelling(false)
    }
  }, [])

  return { cancelDispute, cancelling, error }
}