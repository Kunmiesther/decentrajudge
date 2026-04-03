import { createClient, chains, createAccount } from 'genlayer-js'
import type { Dispute, PlatformStats } from '@/types'

// ─── Types matching genlayer-js internals ─────────────────────────────────────
// Address$1 in the SDK is `0x${string}` & { length: 42 }
// We cast via `as unknown as` to satisfy it without importing internal types
type GLAddress = `0x${string}` & { length: 42 }
type GLTxHash = `0x${string}` & { length: 66 }

function toGLAddress(addr: string): GLAddress {
  return addr as unknown as GLAddress
}

function toGLHash(hash: string): GLTxHash {
  return hash as unknown as GLTxHash
}

// ─── Contract address ─────────────────────────────────────────────────────────
export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  '0x0000000000000000000000000000000000000000'

// ─── Clients ──────────────────────────────────────────────────────────────────

/** Read-only client — no wallet needed */
export function getReadClient() {
  return createClient({ chain: chains.simulator })
}

/** Write client — same client, account injected per-call via MetaMask */
export function getWriteClient() {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    throw new Error('No injected wallet found. Please install MetaMask.')
  }
  return createClient({ chain: chains.simulator })
}

// ─── Read calls ───────────────────────────────────────────────────────────────

export async function fetchAllDisputes(): Promise<Dispute[]> {
  const client = getReadClient()
  const result = await client.readContract({
    address: toGLAddress(CONTRACT_ADDRESS),
    functionName: 'get_all_disputes',
    args: [],
  })
  return (result as Dispute[]) || []
}

export async function fetchDispute(id: string): Promise<Dispute> {
  const client = getReadClient()
  const result = await client.readContract({
    address: toGLAddress(CONTRACT_ADDRESS),
    functionName: 'get_dispute',
    args: [id],
  })
  return result as Dispute
}

export async function fetchDisputesByParty(address: string): Promise<Dispute[]> {
  const client = getReadClient()
  const result = await client.readContract({
    address: toGLAddress(CONTRACT_ADDRESS),
    functionName: 'get_disputes_by_party',
    args: [address],
  })
  return (result as Dispute[]) || []
}

export async function fetchPlatformStats(): Promise<PlatformStats> {
  const client = getReadClient()
  const result = await client.readContract({
    address: toGLAddress(CONTRACT_ADDRESS),
    functionName: 'get_platform_stats',
    args: [],
  })
  return result as PlatformStats
}

// ─── Write calls ──────────────────────────────────────────────────────────────
// GenLayer's writeContract requires value: bigint (mandatory) and
// account: Account (the viem Account object, not a raw address string).
// We use createAccount() from genlayer-js only for the account shape;
// actual signing goes through MetaMask via the injected provider.

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
  // createAccount without a private key creates a "connected" account
  // that delegates signing to the injected wallet
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

export async function txEvaluateDispute(
  disputeId: string,
): Promise<string> {
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

// ─── Utilities ────────────────────────────────────────────────────────────────

export const toWei = (eth: string | number): bigint => {
  const val = typeof eth === 'string' ? parseFloat(eth) : eth
  if (isNaN(val) || val <= 0) return BigInt(0)
  return BigInt(Math.floor(val * 1e18))
}

export const fromWei = (wei: bigint | number): string => {
  const val = typeof wei === 'number' ? BigInt(wei) : wei
  return (Number(val) / 1e18).toFixed(4)
}

export const shortAddress = (addr: string): string => {
  if (!addr || addr.length < 10) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export const generateValidatorPanel = (verdictData?: {
  verdict: string
  reasoning: string
  confidence: number
}) => {
  if (!verdictData) return []
  const confidence = verdictData.confidence ?? 0.7
  const ids = ['#0032', '#0081', '#0114', '#0027', '#0099']
  return ids.map((id, i) => {
    const isAnalyzing = i === 4
    const isFavour = !isAnalyzing && i < Math.ceil(confidence * 5)
    return {
      id: `VALIDATOR ${id}`,
      verdict: isAnalyzing ? 'ANALYZING...' : isFavour ? 'IN FAVOUR' : 'DISPUTED',
      reasoning: isAnalyzing
        ? ''
        : isFavour
        ? verdictData.reasoning.slice(0, 120)
        : 'Assessment diverges from primary ruling on key technical criteria.',
    }
  })
}