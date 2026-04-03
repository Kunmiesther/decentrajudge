import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import {
  ArrowRight,
  FileText,
  Lock,
  Users,
  Scale,
  CheckCircle,
  Shield,
  AlertCircle,
  GitMerge,
} from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: FileText,
    title: 'Submit Your Case',
    description:
      'Either party opens a dispute by describing the job brief in plain English, linking to the deliverable evidence, and defining clear resolution criteria — what "done" looks like.',
    detail:
      'No legal jargon required. The AI validators are trained to interpret human-readable contract terms and compare them against real deliverables.',
    color: 'indigo',
  },
  {
    number: '02',
    icon: Lock,
    title: 'Escrow Funds On-Chain',
    description:
      'The disputed payment is locked in an immutable smart contract on GenLayer. Neither party can access the funds until a verdict is finalized.',
    detail:
      "Escrow is completely trustless — no custodian, no intermediary. The contract code is the only authority over the funds and it can't be altered after deployment.",
    color: 'teal',
  },
  {
    number: '03',
    icon: Users,
    title: 'AI Validators Are Selected',
    description:
      'Five validators are randomly selected using a Verifiable Random Function. Each runs an independent AI model — GPT, LLaMA, Claude, or others.',
    detail:
      'Random selection makes it impossible to predict or bribe the jury. Each validator fetches the evidence URL independently, ensuring no single point of data manipulation.',
    color: 'purple',
  },
  {
    number: '04',
    icon: GitMerge,
    title: 'Optimistic Democracy Consensus',
    description:
      'The Lead validator fetches the evidence and proposes a verdict. The other four validators independently re-evaluate and compare using the Equivalence Principle.',
    detail:
      'Two validators can reach different reasoning paths and still agree on a verdict — as long as both conclusions are equivalent under the defined criteria. This tolerates LLM non-determinism without sacrificing correctness.',
    color: 'amber',
  },
  {
    number: '05',
    icon: Scale,
    title: 'Verdict Is Rendered',
    description:
      'If 3 of 5 validators agree (quorum), the verdict is finalized. The outcome is: Claimant wins, Respondent wins, or a proportional Split.',
    detail:
      "The AI reasoning is stored on-chain alongside the verdict — full transparency for both parties. If consensus isn't reached, a new Lead is appointed and the process restarts.",
    color: 'green',
  },
  {
    number: '06',
    icon: CheckCircle,
    title: 'Escrow Released Automatically',
    description:
      'Once a quorum verdict exists, either party can trigger the finalization transaction. Funds are released automatically according to the verdict — minus a small platform fee.',
    detail:
      'No court enforcement. No waiting. No lawyers. The contract executes the transfer the moment finalization is called. The platform fee (1.5%) goes to the DecentraJudge protocol treasury.',
    color: 'resolved',
  },
]

const FAQS = [
  {
    q: 'What is the Equivalence Principle?',
    a: "It's GenLayer's mechanism for reaching consensus on subjective outputs. Instead of requiring every AI validator to produce identical text, validators agree if their conclusions are semantically equivalent — same verdict, no material contradictions in reasoning.",
  },
  {
    q: 'What if I disagree with the verdict?',
    a: "Currently, the quorum of 3/5 AI validators is final. We're building an appeals layer where a losing party can escalate with additional stake, triggering a fresh panel of validators. This is on the roadmap.",
  },
  {
    q: 'Is the evidence stored permanently?',
    a: 'Evidence URLs are stored on-chain. For guaranteed permanence, we recommend uploading your evidence to IPFS and linking the IPFS hash. This ensures validators can always access the data even if the original URL goes down.',
  },
  {
    q: 'How long does resolution take?',
    a: 'Typically 1–4 hours on GenLayer Simulator, depending on evidence complexity and AI processing time. Resolution time may vary on mainnet based on network conditions.',
  },
  {
    q: 'What currency is used for escrow?',
    a: 'GEN token on GenLayer Simulator, or ETH/native tokens on supported mainnets. The contract is currency-agnostic — whatever the deploying network uses.',
  },
  {
    q: 'Can I use DecentraJudge without coding knowledge?',
    a: 'Yes. The resolution criteria and job briefs are written in plain English. The AI validators interpret natural language — no Solidity or Python required from end users.',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 pt-16">

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-hero-glow" aria-hidden />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-full text-xs font-mono text-text-secondary mb-8">
              <Shield className="w-3 h-3 text-indigo" />
              POWERED BY GENLAYER OPTIMISTIC DEMOCRACY
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-text-primary tracking-tight mb-5">
              How DecentraJudge works
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
              A six-step protocol that turns a disputed payment into a trustless, AI-arbitrated verdict
              — with no lawyers, no courts, and no central authority.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="relative">
            {/* Vertical connector line (desktop) */}
            <div className="hidden lg:block absolute left-[27px] top-10 bottom-10 w-px bg-gradient-to-b from-indigo/40 via-border to-transparent" />

            <div className="space-y-8">
              {STEPS.map((step, i) => {
                const Icon = step.icon
                return (
                  <div key={step.number} className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                    {/* Step indicator */}
                    <div className="flex lg:flex-col items-center gap-4 lg:gap-0 flex-shrink-0">
                      <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center flex-shrink-0 z-10
                        ${step.color === 'indigo' ? 'bg-indigo/10 border-indigo/30' : ''}
                        ${step.color === 'teal' ? 'bg-teal-500/10 border-teal-500/30' : ''}
                        ${step.color === 'purple' ? 'bg-purple-500/10 border-purple-500/30' : ''}
                        ${step.color === 'amber' ? 'bg-amber-500/10 border-amber-500/30' : ''}
                        ${step.color === 'green' ? 'bg-green-500/10 border-green-500/30' : ''}
                        ${step.color === 'resolved' ? 'bg-status-resolved/10 border-status-resolved/30' : ''}
                      `}>
                        <Icon className={`w-6 h-6
                          ${step.color === 'indigo' ? 'text-indigo' : ''}
                          ${step.color === 'teal' ? 'text-teal-400' : ''}
                          ${step.color === 'purple' ? 'text-purple-400' : ''}
                          ${step.color === 'amber' ? 'text-amber-400' : ''}
                          ${step.color === 'green' ? 'text-green-400' : ''}
                          ${step.color === 'resolved' ? 'text-status-resolved' : ''}
                        `} strokeWidth={1.5} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-surface border border-border rounded-2xl p-6 lg:p-8 hover:border-border-light transition-colors">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h2 className="text-xl font-bold text-text-primary">{step.title}</h2>
                        <span className="font-mono text-xs text-text-tertiary bg-surface-2 border border-border px-2.5 py-1 rounded-lg flex-shrink-0">
                          {step.number}
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed mb-4">
                        {step.description}
                      </p>
                      <div className="bg-surface-2 border border-border rounded-xl px-4 py-3">
                        <div className="flex items-start gap-2.5">
                          <AlertCircle className="w-3.5 h-3.5 text-indigo flex-shrink-0 mt-0.5" />
                          <p className="text-text-secondary text-xs leading-relaxed">{step.detail}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Equivalence Principle callout */}
        <section className="border-y border-border bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo/10 border border-indigo/20 rounded-full text-xs font-mono text-indigo mb-6">
                  TECHNICAL DETAIL
                </div>
                <h2 className="text-3xl font-extrabold text-text-primary mb-4">
                  The Equivalence Principle
                </h2>
                <p className="text-text-secondary leading-relaxed mb-4">
                  Traditional blockchains require identical outputs from all validators. This breaks
                  down with AI — two models can read the same GitHub repo and write different
                  summaries that are both accurate.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  GenLayer's Equivalence Principle solves this. Developers define what "equivalent"
                  means for each operation. DecentraJudge uses two modes:
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-background border border-border rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo/10 border border-indigo/20 flex items-center justify-center">
                      <span className="text-xs font-mono text-indigo font-bold">C</span>
                    </div>
                    <h3 className="font-semibold text-text-primary text-sm">Comparative mode</h3>
                  </div>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    Used when fetching evidence URLs. Each validator independently fetches the URL
                    and compares results. Two fetches are equivalent if they describe the same
                    deliverables without material factual contradiction.
                  </p>
                  <div className="mt-3 font-mono text-xs text-indigo/80 bg-indigo/5 rounded-lg px-3 py-2">
                    gl.eq_principle_prompt_comparative(...)
                  </div>
                </div>

                <div className="bg-background border border-border rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <span className="text-xs font-mono text-purple-400 font-bold">N</span>
                    </div>
                    <h3 className="font-semibold text-text-primary text-sm">Non-comparative mode</h3>
                  </div>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    Used for verdict rendering. The Lead validator proposes a verdict. Other validators
                    check if that verdict is a reasonable conclusion — without re-running the full
                    evaluation. They agree if the outcome (claimant/respondent/split) matches and the
                    reasoning has no material contradictions.
                  </p>
                  <div className="mt-3 font-mono text-xs text-purple-400/80 bg-purple-500/5 rounded-lg px-3 py-2">
                    gl.eq_principle_prompt_non_comparative(...)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <h2 className="text-3xl font-extrabold text-text-primary mb-10">
            Frequently asked questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FAQS.map((faq) => (
              <div key={faq.q} className="bg-surface border border-border rounded-xl p-6">
                <h3 className="font-semibold text-text-primary mb-3 text-sm">{faq.q}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
            <h2 className="text-4xl font-extrabold text-text-primary mb-4">
              Ready to resolve your dispute?
            </h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              Open a case in minutes. No lawyers, no waiting weeks for a court date.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/post-dispute" className="btn-primary px-8 py-3.5 text-base w-full sm:w-auto">
                Post a Dispute
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/browse" className="btn-secondary px-8 py-3.5 text-base w-full sm:w-auto">
                Browse Open Cases
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}