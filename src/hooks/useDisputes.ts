'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Dispute, PlatformStats } from '@/types'
import {
  fetchAllDisputes,
  fetchDispute as fetchDisputeFromContract,
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

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useDisputes() {
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [disputeList, platformStats] = await Promise.all([
        fetchAllDisputes(),
        fetchPlatformStats(),
      ])
      setDisputes(disputeList)
      setStats(platformStats)
    } catch (e: any) {
      setError(e?.message || 'Failed to load disputes from contract')
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
      setError(null)
      try {
        const d = await fetchDisputeFromContract(id)
        setDispute(d)
      } catch (e: any) {
        setError(e?.message || 'Dispute not found')
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
        setDisputes(await fetchDisputesByParty(address))
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

  const finalizeVerdict = useCallback(async (disputeId: string) => {
    setFinalizing(true)
    setError(null)
    try {
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

  const cancelDispute = useCallback(async (disputeId: string) => {
    setCancelling(true)
    setError(null)
    try {
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
