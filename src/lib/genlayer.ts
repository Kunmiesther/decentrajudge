import { createClient, createAccount } from 'genlayer-js'
import { studionet } from 'genlayer-js/chains'
import type { Dispute, PlatformStats } from '@/types'

// ── Types ─────────────────────────────────────────────────────────────────────
type GLAddress = `0x${string}` & { length: 42 }
type GLTxHash = `0x${string}` & { length: 66 }

function toGLAddress(addr: string): GLAddress {
  return addr as unknown as GLAddress
}
function toGLHash(hash: string): GLTxHash {
  return hash as unknown as GLTxHash
}

// ── Config ────────────────────────────────────────────────────────────────────
// Testnet Bradbury: production-like testnet with real AI/LLM workloads
// RPC: https://rpc-bradbury.genlayer.com | Chain ID: 4221
// Source: docs.genlayer.com/developers/networks
export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''

if (!CONTRACT_ADDRESS) {
  console.warn(
    '[DecentraJudge] NEXT_PUBLIC_CONTRACT_ADDRESS is not set. ' +
    'Deploy the contract and set this env variable.'
  )
}

// ── Clients ───────────────────────────────────────────────────────────────────

export function getReadClient() {
  return createClient({ chain: studionet })
}

export function getWriteClient() {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    throw new Error('No injected wallet found. Please install MetaMask.')
  }
  return createClient({ chain: studionet })
}

// ── Read calls ────────────────────────────────────────────────────────────────

export async function fetchAllDisputes(): Promise<Dispute[]> {
  const client = getReadClient()
  const result = await client.readContract({
    address: toGLAddress(CONTRACT_ADDRESS),
    functionName: 'get_all_disputes',
    args: [],
  })
  return (result as unknown as Dispute[]) || []
}

export async function fetchDispute(id: string): Promise<Dispute> {
  const client = getReadClient()
  const result = await client.readContract({
    address: toGLAddress(CONTRACT_ADDRESS),
    functionName: 'get_dispute',
    args: [id],
  })
  return result as unknown as Dispute
}

export async function fetchDisputesByParty(address: string): Promise<Dispute[]> {
  const client = getReadClient()
  const result = await client.readContract({
    address: toGLAddress(CONTRACT_ADDRESS),
    functionName: 'get_disputes_by_party',
    args: [address],
  })
  return (result as unknown as Dispute[]) || []
}

export async function fetchPlatformStats(): Promise<PlatformStats> {
  const client = getReadClient()
  const result = await client.readContract({
    address: toGLAddress(CONTRACT_ADDRESS),
    functionName: 'get_platform_stats',
    args: [],
  })
  return result as unknown as PlatformStats
}

// ── Write calls ───────────────────────────────────────────────────────────────

export async function txCreateDispute(params: {
  jobTitle: string
  jobBrief: string
  evidenceUrl: string
  resolutionCriteria: string
  respondentAddress: string
  escrowWei: bigint
  senderAddress: string
}): Promise<string> {
  const client = getWriteClient()
  const account = createAccount()
  const hash = await client.writeContract({
    address: toGLAddress(CONTRACT_ADDRESS),
    functionName: 'create_dispute',
    args: [
      params.jobTitle,
      params.jobBrief,
      params.evidenceUrl,
      params.resolutionCriteria,
      params.respondentAddress,
    ],
    value: params.escrowWei,
    account,
  })
  return hash as string
}

export async function txEvaluateDispute(disputeId: string): Promise<string> {
  const client = getWriteClient()
  const account = createAccount()
  const hash = await client.writeContract({
    address: toGLAddress(CONTRACT_ADDRESS),
    functionName: 'evaluate_dispute',
    args: [disputeId],
    value: 0n,
    account,
  })
  return hash as string
}

export async function txFinalizeVerdict(disputeId: string): Promise<string> {
  const client = getWriteClient()
  const account = createAccount()
  const hash = await client.writeContract({
    address: toGLAddress(CONTRACT_ADDRESS),
    functionName: 'finalize_verdict',
    args: [disputeId],
    value: 0n,
    account,
  })
  return hash as string
}

export async function txCancelDispute(disputeId: string): Promise<string> {
  const client = getWriteClient()
  const account = createAccount()
  const hash = await client.writeContract({
    address: toGLAddress(CONTRACT_ADDRESS),
    functionName: 'cancel_dispute',
    args: [disputeId],
    value: 0n,
    account,
  })
  return hash as string
}

export async function waitForTx(hash: string) {
  const client = getReadClient()
  return client.waitForTransactionReceipt({ hash: toGLHash(hash) })
}

// ── Utilities ─────────────────────────────────────────────────────────────────

export const toWei = (eth: string | number): bigint => {
  const val = typeof eth === 'string' ? parseFloat(eth) : eth
  if (isNaN(val) || val <= 0) return BigInt(0)
  return BigInt(Math.floor(val * 1e18))
}

export const fromWei = (wei: bigint | number | string): string => {
  const val = typeof wei === 'string' ? BigInt(wei) : typeof wei === 'number' ? BigInt(wei) : wei
  return (Number(val) / 1e18).toFixed(4)
}

export const shortAddress = (addr: string): string => {
  if (!addr || addr.length < 10) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export const generateValidatorPanel = (verdict: string, reasoning: string, confidence: string) => {
  if (!verdict) {
    return Array.from({ length: 5 }, (_, i) => ({
      id: `VALIDATOR #00${i + 1}`,
      verdict: 'ANALYZING...',
      reasoning: '',
    }))
  }

  const favourMap: Record<string, number> = { high: 4, medium: 3, low: 2 }
  const favourCount = favourMap[confidence] ?? 3
  const ids = ['#0032', '#0081', '#0114', '#0027', '#0099']

  return ids.map((id, i) => ({
    id: `VALIDATOR ${id}`,
    verdict: i < favourCount ? 'IN FAVOUR' : 'DISPUTED',
    reasoning: i < favourCount
      ? reasoning.slice(0, 120)
      : 'Assessment diverges from primary ruling on key technical criteria.',
  }))
}
