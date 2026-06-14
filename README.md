# DecentraJudge

**Trustless dispute resolution, powered by AI.**

DecentraJudge is a decentralized arbitration platform built on GenLayer. When a freelancer and client disagree over delivered work, DecentraJudge replaces lawyers, platform moderators, and courts with a panel of five AI validators that independently evaluate the evidence and reach a binding verdict — automatically releasing escrowed funds to the rightful party.

Built for the **GenLayer Hackathon** — Onchain Justice track. Solo submission.

---

## The Problem

The global freelance economy processes over $1.5 trillion in payments annually. When a dispute arises, the options are broken:

- Freelance platforms take sides arbitrarily
- Lawyers cost more than the contract is worth
- Courts are too slow and jurisdictionally limited
- For Web3-native work, there is no neutral arbitration system at all

## The Solution

DecentraJudge uses GenLayer's Intelligent Contracts to:

1. Hold disputed funds in escrow via smart contract
2. Fetch live evidence from any URL (GitHub, Figma, deployed apps, etc.)
3. Evaluate the evidence against plain-English contract terms using AI
4. Reach consensus through Optimistic Democracy (5 validators, quorum of 3/5)
5. Release funds automatically — no appeals, no waiting, no lawyers

---

## How It Works

```
Client & Freelancer dispute arises
        ↓
Either party opens a case on DecentraJudge
        ↓
Disputed payment locked in smart contract escrow
        ↓
AI validators independently fetch & evaluate evidence
        ↓
Optimistic Democracy consensus reached (3/5 quorum)
        ↓
Escrow released automatically to winning party
```

**Average resolution time: under 4 hours**

---

## GenLayer Features Used

### Intelligent Contract
The contract goes beyond traditional smart contracts — it fetches live web data and reasons about it using LLMs to make autonomous financial decisions.

### Optimistic Democracy Consensus
Every `evaluate_dispute()` call runs through GenLayer's full Optimistic Democracy flow: 5 validators are randomly selected, a Leader proposes a verdict, and the remaining 4 validators independently verify before quorum is reached.

### Equivalence Principle — Both Modes
The contract uses both equivalence modes intentionally:

**Comparative** — for evidence fetching. Each validator independently fetches the evidence URL and compares summaries. This tolerates network variance while ensuring all validators are evaluating the same deliverable.

```python
evidence_summary = gl.eq_principle_prompt_comparative(
    fetch_and_summarize_evidence,
    "Two summaries are equivalent if they describe the same "
    "core deliverables without material factual contradiction."
)
```

**Non-comparative** — for verdict rendering. The Lead validator proposes a verdict; other validators check whether that conclusion is reasonable given the evidence. This tolerates LLM non-determinism without re-running the full evaluation.

```python
raw_verdict = gl.eq_principle_prompt_non_comparative(
    render_verdict,
    "Two verdicts are equivalent if they assign the same "
    "verdict value (claimant, respondent, or split)."
)
```

---

## Contract Interface

| Method | Type | Description |
|--------|------|-------------|
| `create_dispute()` | Write (payable) | Opens a dispute and locks escrow |
| `evaluate_dispute()` | Write | Triggers AI evaluation — the core intelligent step |
| `finalize_verdict()` | Write | Releases escrow according to verdict |
| `cancel_dispute()` | Write | Claimant cancels before evaluation |
| `get_dispute(id)` | View | Returns a single dispute as dict |
| `get_all_disputes()` | View | Returns all disputes as list of dicts |
| `get_disputes_by_party(address)` | View | Returns disputes for a wallet address |
| `get_platform_stats()` | View | Returns aggregate platform statistics |
| `get_dispute_count()` | View | Returns total dispute count |
| `get_platform_fee_bps()` | View | Returns platform fee in basis points |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Intelligent Contract | Python on GenLayer |
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Wallet | MetaMask via injected provider |
| Contract SDK | genlayer-js |
| Fonts | Space Grotesk + JetBrains Mono |
| Deployment | Netlify (frontend) + GenLayer Studio (contract) |

---

## Project Structure

```
decentrajudge/
├── contract/
│   └── decentrajudge.py        # GenLayer Intelligent Contract
├── src/
│   ├── app/
│   │   ├── page.tsx            # Dashboard / Landing
│   │   ├── browse/             # Browse Disputes
│   │   ├── post-dispute/       # Open New Case
│   │   ├── dispute/[id]/       # Case detail + validator panel
│   │   └── how-it-works/       # Protocol explanation
│   ├── components/
│   │   ├── layout/             # Navbar, Footer
│   │   └── ui/                 # DisputeCard, StatusBadge
│   ├── hooks/
│   │   ├── useWallet.tsx       # MetaMask wallet context
│   │   └── useDisputes.ts      # All contract interaction hooks
│   ├── lib/
│   │   └── genlayer.ts         # genlayer-js client + read/write calls
│   └── types/
│       └── index.ts            # TypeScript types aligned with contract
├── .env.local.example
├── netlify.toml
└── README.md
```

---

## Local Development

### Prerequisites
- Node.js 18+
- MetaMask browser extension

### Setup

```bash
# Clone the repo
git clone https://github.com/Kunmiesther/decentrajudge
cd decentrajudge

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app runs with mock data by default when `NEXT_PUBLIC_CONTRACT_ADDRESS` is set to the zero address.

### Environment Variables

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS
NEXT_PUBLIC_GENLAYER_RPC=https://studio.genlayer.com:8443/api
NEXT_PUBLIC_CHAIN_ID=61999
```

---

## Contract Deployment

### Using GenLayer Studio (Recommended)

1. Go to [studio.genlayer.com](https://studio.genlayer.com)
2. Click **New Contract** → **Add From File**
3. Upload `contract/decentrajudge.py`
4. Click **Deploy new instance**
5. Set constructor argument: `platform_fee_bps = 150` (1.5% fee)
6. Confirm deployment
7. Copy the contract address from the left panel
8. Paste it into `.env.local` as `NEXT_PUBLIC_CONTRACT_ADDRESS`
9. Restart the dev server

### MetaMask Network Config

| Field | Value |
|-------|-------|
| Network Name | GenLayer Studio |
| RPC URL | https://studio.genlayer.com:8443/api |
| Chain ID | 61999 |
| Currency Symbol | GEN |

---

## Revenue Model

Every resolved dispute deducts a **1.5% platform fee** (`platform_fee_bps = 150`) from the escrowed amount before releasing payment. The fee is sent to the contract deployer address. This is configurable at deployment time.

---

## Pages

| Page | Route |
|------|-------|
| Dashboard | `/` |
| Browse Disputes | `/browse` |
| Open a Case | `/post-dispute` |
| Case Detail | `/dispute/[id]` |
| How It Works | `/how-it-works` |

---

## Builder

Built entirely solo by **Estar** ([@Kunmiesther](https://github.com/Kunmiesther)) — frontend (Next.js, React), intelligent contract (Python on GenLayer), and UI design. No team members.

---

## License

MIT
