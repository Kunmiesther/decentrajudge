# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
from genlayer import gl
from dataclasses import dataclass
import json


@allow_storage
@dataclass
class Dispute:
    id: str
    job_title: str
    job_brief: str
    evidence_url: str
    resolution_criteria: str
    claimant: Address
    respondent: Address
    escrow_amount: u256
    status: str
    verdict: str
    verdict_reasoning: str
    verdict_confidence: str
    evidence_summary: str
    created_at: u256
    resolved_at: u256


class DecentraJudge(gl.Contract):

    disputes: TreeMap[str, Dispute]
    dispute_count: u256
    platform_fee_bps: u256
    owner: Address

    def __init__(self, platform_fee_bps: u256):
        self.disputes = TreeMap[str, Dispute]()
        self.dispute_count = u256(0)
        self.platform_fee_bps = platform_fee_bps
        self.owner = gl.message.sender_address

    @gl.public.write.payable
    def create_dispute(
        self,
        job_title: str,
        job_brief: str,
        evidence_url: str,
        resolution_criteria: str,
        respondent_address: Address,
    ) -> str:
        assert len(job_title) > 0, "Job title cannot be empty"
        assert len(job_brief) > 0, "Job brief cannot be empty"
        assert len(evidence_url) > 0, "Evidence URL cannot be empty"
        assert len(resolution_criteria) > 0, "Resolution criteria cannot be empty"
        assert gl.message.value > 0, "Must escrow funds to open a dispute"

        dispute_id = str(int(self.dispute_count))
        self.dispute_count = self.dispute_count + u256(1)

        dispute = Dispute(
            id=dispute_id,
            job_title=job_title,
            job_brief=job_brief,
            evidence_url=evidence_url,
            resolution_criteria=resolution_criteria,
            claimant=gl.message.sender_address,
            respondent=respondent_address,
            escrow_amount=u256(gl.message.value),
            status="pending",
            verdict="",
            verdict_reasoning="",
            verdict_confidence="",
            evidence_summary="",
            created_at=u256(gl.message.timestamp),
            resolved_at=u256(0),
        )

        self.disputes[dispute_id] = dispute
        return dispute_id

    @gl.public.write
    def evaluate_dispute(self, dispute_id: str) -> None:
        assert dispute_id in self.disputes, "Dispute not found"
        dispute = gl.storage.copy_to_memory(self.disputes[dispute_id])
        assert dispute.status == "pending", "Dispute is not in pending state"
        assert (
            gl.message.sender_address == dispute.claimant
            or gl.message.sender_address == dispute.respondent
        ), "Only parties to the dispute can trigger evaluation"

        self.disputes[dispute_id].status = "under_review"

        job_title = dispute.job_title
        job_brief = dispute.job_brief
        evidence_url = dispute.evidence_url
        resolution_criteria = dispute.resolution_criteria

        def fetch_and_summarize_evidence():
            evidence_content = gl.get_webpage(evidence_url, mode="text")
            summary_prompt = (
                "You are an impartial technical reviewer. "
                "You have fetched the following evidence submitted for a freelance dispute.\n\n"
                "EVIDENCE URL: " + evidence_url + "\n\n"
                "EVIDENCE CONTENT:\n"
                + evidence_content[:6000]
                + "\n\nProvide a concise factual summary (max 200 words) of what this evidence contains. "
                "Focus only on objective facts. Do NOT make any judgment. Just summarize what is there."
            )
            return gl.exec_prompt(summary_prompt)

        evidence_summary = gl.eq_principle_prompt_comparative(
            fetch_and_summarize_evidence,
            "Two evidence summaries are equivalent if they describe the same "
            "core deliverables without material factual contradiction.",
        )

        def render_verdict():
            verdict_prompt = (
                "You are an impartial AI arbitrator on a decentralized dispute resolution panel.\n"
                "Determine whether the claimant delivered work meets the agreed requirements.\n\n"
                "JOB TITLE: " + job_title + "\n\n"
                "WHAT WAS AGREED:\n" + job_brief + "\n\n"
                "RESOLUTION CRITERIA:\n" + resolution_criteria + "\n\n"
                "EVIDENCE SUMMARY:\n" + evidence_summary + "\n\n"
                "Respond with ONLY a valid JSON object:\n"
                '{"verdict": "claimant" or "respondent" or "split", '
                '"confidence": "high" or "medium" or "low", '
                '"reasoning": "2-3 sentence explanation"}\n\n'
                "claimant = work meets requirements.\n"
                "respondent = work fails requirements.\n"
                "split = partial delivery."
            )
            return gl.exec_prompt(verdict_prompt)

        raw_verdict = gl.eq_principle_prompt_non_comparative(
            render_verdict,
            "Two verdict outputs are equivalent if they assign the same "
            "verdict value (claimant, respondent, or split).",
        )

        verdict_value = "split"
        verdict_reasoning = raw_verdict[:500]
        verdict_confidence = "medium"

        try:
            clean = raw_verdict.strip()
            if "```" in clean:
                parts = clean.split("```")
                clean = parts[1] if len(parts) > 1 else clean
                if clean.startswith("json"):
                    clean = clean[4:]
            parsed = json.loads(clean.strip())
            verdict_value = parsed.get("verdict", "split")
            verdict_reasoning = parsed.get("reasoning", raw_verdict[:500])
            verdict_confidence = parsed.get("confidence", "medium")
        except Exception:
            raw_lower = raw_verdict.lower()
            if "claimant" in raw_lower:
                verdict_value = "claimant"
            elif "respondent" in raw_lower:
                verdict_value = "respondent"

        self.disputes[dispute_id].verdict = verdict_value
        self.disputes[dispute_id].verdict_reasoning = verdict_reasoning
        self.disputes[dispute_id].verdict_confidence = verdict_confidence
        self.disputes[dispute_id].evidence_summary = evidence_summary
        self.disputes[dispute_id].status = "resolved"
        self.disputes[dispute_id].resolved_at = u256(gl.message.timestamp)

    @gl.public.write
    def finalize_verdict(self, dispute_id: str) -> None:
        assert dispute_id in self.disputes, "Dispute not found"
        dispute = gl.storage.copy_to_memory(self.disputes[dispute_id])
        assert dispute.status == "resolved", "Dispute has not been resolved yet"
        assert len(dispute.verdict) > 0, "No verdict recorded"

        escrow = int(dispute.escrow_amount)
        fee = (escrow * int(self.platform_fee_bps)) // 10000
        payout = escrow - fee
        verdict = dispute.verdict

        if verdict == "claimant":
            gl.transfer(dispute.claimant, payout)
        elif verdict == "respondent":
            gl.transfer(dispute.respondent, payout)
        elif verdict == "split":
            half = payout // 2
            gl.transfer(dispute.claimant, half)
            gl.transfer(dispute.respondent, payout - half)

        if fee > 0:
            gl.transfer(self.owner, fee)

        self.disputes[dispute_id].status = "finalized"

    @gl.public.write
    def cancel_dispute(self, dispute_id: str) -> None:
        assert dispute_id in self.disputes, "Dispute not found"
        dispute = gl.storage.copy_to_memory(self.disputes[dispute_id])
        assert dispute.claimant == gl.message.sender_address, "Only claimant can cancel"
        assert dispute.status == "pending", "Can only cancel pending disputes"

        gl.transfer(dispute.claimant, int(dispute.escrow_amount))
        self.disputes[dispute_id].status = "cancelled"

    @gl.public.view
    def get_dispute(self, dispute_id: str) -> str:
        assert dispute_id in self.disputes, "Dispute not found"
        d = gl.storage.copy_to_memory(self.disputes[dispute_id])
        return json.dumps({
            "id": d.id,
            "job_title": d.job_title,
            "job_brief": d.job_brief,
            "evidence_url": d.evidence_url,
            "resolution_criteria": d.resolution_criteria,
            "claimant": str(d.claimant),
            "respondent": str(d.respondent),
            "escrow_amount": str(int(d.escrow_amount)),
            "status": d.status,
            "verdict": d.verdict,
            "verdict_reasoning": d.verdict_reasoning,
            "verdict_confidence": d.verdict_confidence,
            "evidence_summary": d.evidence_summary,
            "created_at": str(int(d.created_at)),
            "resolved_at": str(int(d.resolved_at)),
        })

    @gl.public.view
    def get_dispute_count(self) -> u256:
        return self.dispute_count

    @gl.public.view
    def get_platform_fee_bps(self) -> u256:
        return self.platform_fee_bps