# Agent Autonomy Spectrum

## Where We Are

Most teams using AI for delivery work the same way: human directs, AI holds the pen. The human decides what to build, steers every session, makes every judgment call. The AI drafts, structures, and surfaces questions. This is productive — what took a sprint now takes an afternoon — but the human is still the bottleneck for every decision, every review, every course correction.

AIDOS is designed for this mode. The pulse-based rhythm (sprint → park → align → feed back) exists because humans are slow and AI is fast, and the framework respects that gap.

## Where It's Going

AI capabilities are moving fast. Agents are getting better at proposing next steps, assessing quality, and operating with less direction. The trajectory is clear:

**Today** — human directs, AI assists. The rubrics are a checklist the human uses to guide a thorough review.

**Near-term** — AI drives, human supervises. The AI proposes what to work on, drafts proactively, and runs audits autonomously. The human steers, disposes Risks, and spot-checks. The rubrics become the contract between the AI builder and the AI auditor.

**Eventually** — autonomous pipelines. AI builder and AI auditor operate independently. Humans intervene on escalations and periodic spot-checks. The rubrics become the specification — the quality bar without a human in every loop.

## Why the Framework Is Ready for This

The artifact stack, rubrics, coherence chain, and builder/auditor separation are deliberately agent-agnostic. Nothing in the quality mechanism depends on a human being in the loop for every pass. It depends on the rubric criteria being precise enough to assess consistently — and that's true whether the assessor is a person or an AI.

The three-pass rule and escalation mechanism are safety valves that work at every level of autonomy. When the autonomous loop can't resolve a finding after three passes, it escalates — to a human, with a decision packet. The framework doesn't assume humans are always present. It assumes humans are always reachable.

## Why Rubric Quality Matters Now

This is the practical takeaway. At every step along the spectrum, the limiting factor is rubric quality:

- **Human-directed:** vague rubrics are survivable — the human compensates with judgment
- **AI-driven:** vague rubrics produce vague audits — the AI can't compensate
- **Autonomous:** vague rubrics are system failures — nobody catches what the rubric misses

Investing in rubric quality today — making criteria testable, evidence standards explicit, pass conditions unambiguous — is not polish. It's building the contract that makes each level of delegation safe rather than reckless. The contribution model ("pain, not taste") is the mechanism that keeps rubrics grounded as they sharpen.

Better rubrics today are the contract that enables agent autonomy tomorrow. That's a reason to invest now, not later.
