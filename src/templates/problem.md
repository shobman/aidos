<!--
PROBLEM ARTIFACT TEMPLATE

What this is:
  The Problem artifact answers: what is happening, for whom, why it matters,
  and what success looks like. It's the foundation of the artifact stack.
  Everything downstream — Solution, Tech Design, Testing — builds on this.

Rubric criteria:
  Core Rubric (C1–C14) — applied to every artifact. Core criteria are
  cross-cutting: you address them through the sections below, not in
  separate sections. In particular:
    C1  Alignment to goals — every element traces to a stated goal
    C2  Simplicity — simplest framing that captures the real problem
    C3  Explicit trade-offs — choices in scoping are documented
    C4  Failure modes — what happens if the problem is misframed
    C5  Testability — goals can be verified
    C6  Observability — you'd know if the problem recurs after solving it
    C7  Security — security implications surfaced where relevant
    C8  Reversibility — which decisions here are hard to undo
    C9  Future team readiness — no tribal knowledge required
    C10 Internal consistency — terminology and framing are consistent
    C11 No duplication — reference, don't copy, from other artifacts
    C12 Single unit of work — one problem, decompose if it's too many
    C13 Implementation neutrality at the right altitude — Problem prose
        names no tools/vendors/schemas/libraries unless pre-existing constraints
    C14 Title altitude — the title states the problem being solved, not
        the part being built

  Problem Rubric (P1–P13) — discipline-specific criteria. Each section
  below maps to one or more of these:
    P1  Clarity → Problem Statement
    P2  Stakeholder identification → Stakeholders
    P3  Goal measurability → Goals and Success Criteria
    P4  Root cause confidence → Root Cause Analysis
    P5  Scope justification → Scope
    P6  Non-goals → Non-Goals
    P7  Assumptions surfaced → Assumptions
    P8  Constraints identified → Constraints
    P9  Impact and urgency → Impact and Urgency
    P10 Existing alternatives considered → Existing Alternatives
    P11 Honest framing → cross-cutting across the artifact's prose
        (no dedicated section — the whole Problem must read honestly)
    P12 System purpose grounding → Problem Statement (open with who the
        system serves and what success looks like, before any pain)
    P13 Epic goal altitude → Goals and Success Criteria (Epic scope: every
        goal observed by users/operators/business, never the codebase)

Coherence check:
  The Problem artifact is the start of the stack. No preceding artifact
  to check against. At Feature or Story scale, verify consistency with
  the parent Epic problem.

Scaling depth:
  Epic — full depth. Every section is thorough.
  Feature — lighter if the Epic problem is strong. Focus on what's
  specific to this feature.
  Story — most sections can be one line.

  Scale down by keeping sections brief, not by deleting them. A one-line
  Assumptions section that says "inherits from Epic" is better than no
  Assumptions section.
-->

# Problem: [title]

**Status:** DRAFT | REVIEW | ACCEPTED
**AIDOS Version:** 2.0.0
**Parent:** [link to Epic problem, if this is Feature or Story scale]

---

## Problem Statement
<!-- P1: Clarity. State what's wrong, for whom, and why it matters.
     Plain language. No jargon without definition. A reader unfamiliar
     with the project should understand this without prior conversation. -->

[What is happening, who is affected, and why it matters.]

## Stakeholders
<!-- P2: Stakeholder identification. Name every affected party. -->

| Stakeholder | Role | Interest |
|---|---|---|
| | Experiences the problem | |
| | Owns the outcome | |
| | Approves the solution | |
| | Impacted by change | |
| | Can block progress | |

## Goals and Success Criteria
<!-- P3: Goal measurability. Specific, measurable, verifiable.
     "Reduce X to under Y" not "improve Z." -->

| # | Goal | Success Metric | How Verified |
|---|---|---|---|
| G1 | | | |
| G2 | | | |

## Non-Goals
<!-- P6: Non-goals. What this artifact explicitly will not address, and why. -->

- [Related concern deliberately excluded — reason.]

## Root Cause Analysis
<!-- CONDITIONAL: include only when the problem is contested or symptoms
     are likely conflated with cause. Omit when the cause is well-understood. -->
<!-- P4: Root cause confidence. Distinguish symptoms from causes.
     State confidence level. Cite evidence where available. -->

**Symptoms observed:**
[What people see and report.]

**Hypothesised root cause:**
[What's actually causing it, with evidence or confidence level.]

## Scope
<!-- CONDITIONAL: include only when Goals + Non-Goals do not already carry
     the boundary clearly. Usually omit — the boundary is in Goals/Non-Goals. -->
<!-- P5: Scope justification. Everything here traces to a goal above.
     Nothing crept in without justification. -->

**In scope:**
- [Item — traces to G1]

**Out of scope:**
- [Item — reason for exclusion]

## Impact and Urgency
<!-- P9: Impact and urgency. Quantify where possible. Why now. -->

[Cost of the problem: time lost, revenue at risk, users affected, manual effort.
Why this needs addressing now. What happens if it isn't.]

## Assumptions
<!-- P7: Assumptions surfaced. List each one. Flag critical assumptions
     that would invalidate the problem framing if false. -->

| # | Assumption | If Wrong | Critical? |
|---|---|---|---|
| A1 | | | |

## Constraints
<!-- P8: Constraints identified. Regulatory, technical, organisational,
     timeline, budget. Don't make the Solution author discover these. -->

| # | Constraint | Type | Source |
|---|---|---|---|
| K1 | | | |

## Existing Alternatives
<!-- CONDITIONAL: include only when build-vs-buy is genuinely in play.
     Omit for problems clearly inside the team's scope of work. -->
<!-- P10: Existing alternatives considered. Is this already solved?
     Building is not the default — it's justified. -->

| Alternative | Why Insufficient |
|---|---|
| | |

---

## Issues
<!-- Source: where this issue was first identified — an artifact name, session, meeting, or external input. -->

| # | Source | Issue | Status |
|---|---|---|---|
| I1 | | | OPEN / SOCIALISE / ESCALATE |

## Decisions

| # | Source | Issue | Resolution | Decided By | Date |
|---|---|---|---|---|---|
| D1 | | | | | |

## Auditor Notes

<!--
Populated by the AIDOS Auditor skill. Rewritten on each audit pass — latest
findings only; git carries the history. Cleared once the artifact is final (no
open Bugs, no new findings on the latest pass).

Findings are classified per framework.md § Builder / Auditor Separation:
- Bug — must fix before proceeding
- Risk — surface; may become an Issue
- Idea — noted, not actioned
-->

### Bugs (open)

<!-- Format per finding:
- [B1] {Brief finding} — evidence: "{cited quote from artifact, or section reference}"
-->

_None_

### Risks

<!-- Format per finding:
- [R1] {Brief finding} — evidence: "{cited quote or section reference}"
-->

_None_

### Ideas

<!-- Format per finding:
- [I1] {Brief finding} — evidence: "{cited quote or section reference}"
-->

_None_
