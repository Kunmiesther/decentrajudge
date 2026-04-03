'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Shield, Users, Zap, ChevronDown, ChevronUp } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useCreateDispute } from '@/hooks/useDisputes'
import { useWallet } from '@/hooks/useWallet'
import clsx from 'clsx'

export default function PostDisputePage() {
  const router = useRouter()
  const { isConnected, connect, address } = useWallet()
  const { createDispute, submitting, txHash, error } = useCreateDispute()

  const [form, setForm] = useState({
    jobTitle: '',
    jobBrief: '',
    escrowAmount: '',
    evidenceUrl: '',
    respondentAddress: '',
    resolutionCriteria: 'Work is acceptable if it meets all stated requirements and functions as described.',
  })
  const [criteriaOpen, setCriteriaOpen] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!isConnected) { connect(); return }

    const ok = await createDispute({
      jobTitle: form.jobTitle,
      jobBrief: form.jobBrief,
      evidenceUrl: form.evidenceUrl,
      resolutionCriteria: form.resolutionCriteria,
      respondentAddress: form.respondentAddress,
      escrowAmountEth: form.escrowAmount,
      senderAddress: address || '',
    })

    if (ok) setSuccess(true)
  }

  if (success) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-16 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-status-resolved-bg border border-status-resolved/30 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-status-resolved" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Case Opened</h2>
            <p className="text-text-secondary mb-2">Your dispute has been submitted and funds escrowed.</p>
            {txHash && (
              <p className="font-mono text-xs text-text-tertiary mb-8 break-all">{txHash}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => router.push('/browse')} className="btn-primary">
                Browse Disputes
              </button>
              <button onClick={() => { setSuccess(false); setForm({ jobTitle: '', jobBrief: '', escrowAmount: '', evidenceUrl: '', respondentAddress: '', resolutionCriteria: 'Work is acceptable if it meets all stated requirements and functions as described.' }) }} className="btn-secondary">
                Open Another
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-text-primary mb-3">Open a New Case</h1>
            <p className="text-text-secondary text-base">
              Submit your evidence and escrow the dispute funds to initiate the resolution protocol.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Form */}
            <div className="flex-1">
              <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
                <div className="space-y-6">
                  {/* Job Title */}
                  <div>
                    <label className="block text-xs font-mono tracking-widest text-text-secondary uppercase mb-2">
                      Job Title
                    </label>
                    <input
                      name="jobTitle"
                      value={form.jobTitle}
                      onChange={handleChange}
                      placeholder="e.g. Frontend Refactor for DAO Dashboard"
                      className="input-field"
                    />
                  </div>

                  {/* Job Brief */}
                  <div>
                    <label className="block text-xs font-mono tracking-widest text-text-secondary uppercase mb-2">
                      Describe what was agreed, in plain English
                    </label>
                    <textarea
                      name="jobBrief"
                      value={form.jobBrief}
                      onChange={handleChange}
                      rows={6}
                      placeholder="List the specific milestones and deliverables that were expected..."
                      className="input-field resize-none"
                    />
                  </div>

                  {/* Amount + Evidence URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono tracking-widest text-text-secondary uppercase mb-2">
                        Escrow Amount (GEN)
                      </label>
                      <div className="relative">
                        <input
                          name="escrowAmount"
                          value={form.escrowAmount}
                          onChange={handleChange}
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className="input-field pr-14"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-text-tertiary">
                          GEN
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono tracking-widest text-text-secondary uppercase mb-2">
                        Link to Deliverable — GitHub, Figma, etc.
                      </label>
                      <input
                        name="evidenceUrl"
                        value={form.evidenceUrl}
                        onChange={handleChange}
                        type="url"
                        placeholder="https://"
                        className="input-field"
                      />
                    </div>
                  </div>

                  {/* Respondent Address */}
                  <div>
                    <label className="block text-xs font-mono tracking-widest text-text-secondary uppercase mb-2">
                      Respondent Wallet Address
                    </label>
                    <input
                      name="respondentAddress"
                      value={form.respondentAddress}
                      onChange={handleChange}
                      placeholder="0x..."
                      className="input-field"
                    />
                  </div>

                  {/* Resolution Criteria (collapsible) */}
                  <div className="border border-border rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setCriteriaOpen(!criteriaOpen)}
                      className="w-full flex items-center justify-between px-5 py-4 text-text-primary hover:bg-surface-2 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <svg className="w-4 h-4 text-indigo" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        <span className="font-medium text-sm">Resolution Criteria</span>
                      </div>
                      {criteriaOpen ? <ChevronUp className="w-4 h-4 text-text-secondary" /> : <ChevronDown className="w-4 h-4 text-text-secondary" />}
                    </button>

                    {criteriaOpen && (
                      <div className="px-5 pb-5 border-t border-border">
                        <p className="text-xs text-text-tertiary mb-3 mt-3">
                          Define what "done" means for this job. AI validators will use this to evaluate the evidence.
                        </p>
                        <textarea
                          name="resolutionCriteria"
                          value={form.resolutionCriteria}
                          onChange={handleChange}
                          rows={4}
                          className="input-field resize-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="bg-status-disputed-bg border border-status-disputed/20 rounded-xl px-4 py-3 text-status-disputed text-sm">
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !form.jobTitle || !form.jobBrief}
                    className={clsx('btn-primary w-full py-4 text-base', submitting && 'opacity-70')}
                  >
                    <CreditCard className="w-5 h-5" />
                    {submitting ? 'Submitting transaction...' : isConnected ? 'Submit & Escrow Funds' : 'Connect Wallet to Continue'}
                  </button>

                  <p className="text-center text-xs font-mono tracking-widest text-text-tertiary uppercase">
                    Transaction Secured by GenLayer
                  </p>
                </div>
              </div>
            </div>

            {/* Side info cards */}
            <div className="lg:w-72 flex flex-col gap-4">
              {[
                {
                  icon: Shield,
                  title: 'Secure Escrow',
                  desc: 'Funds are locked in a smart contract and only released upon consensus or settlement.',
                },
                {
                  icon: Users,
                  title: 'Decentralized Jury',
                  desc: 'Randomly selected jurors review evidence to ensure unbiased justice for every case.',
                },
                {
                  icon: Zap,
                  title: 'Fast Resolution',
                  desc: 'Cases are typically resolved within 72 hours of submission and evidence review.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-surface border border-border rounded-xl p-5">
                  <Icon className="w-5 h-5 text-text-secondary mb-3" strokeWidth={1.5} />
                  <h3 className="font-semibold text-text-primary text-sm mb-1.5">{title}</h3>
                  <p className="text-text-secondary text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}