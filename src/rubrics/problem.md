# Problem Rubric

Discipline-specific criteria for assessing Problem artifacts through the **Product lens**. This rubric checks whether the problem is defined well enough to solve — or whether the team is about to build a solution to the wrong question.

---

## Criteria

| # | Criterion | What "Pass" Looks Like |
|---|---|---|
| P1 | Clarity | The problem is stated in plain language. A reader unfamiliar with the project can understand what's wrong, for whom, and why it matters — without jargon, acronyms, or assumed context. If a term requires domain knowledge, it's defined. |
| P2 | Stakeholder identification | All affected parties are named — who experiences the problem, who owns the outcome, who needs to approve the solution, who is impacted by change, and who can block progress. No implicit stakeholders. Absence of a stakeholder is stated and justified, not an oversight. |
| P3 | Goal measurability | Success criteria are specific and measurable. "Reduce lookup time to under 30 seconds" passes. "Improve the experience" does not. Each goal has a defined method of verification. The difference between full success and partial success is clear. |
| P4 | Root cause confidence | The artifact distinguishes between symptoms and causes. Where the root cause is known, evidence is cited. Where it's uncertain, that uncertainty is explicit and the level of confidence is stated. The artifact doesn't present a guess as a fact. |
| P5 | Scope justification | Everything in scope traces to a stated need or goal. Nothing has crept in without justification. The boundary between "must solve" and "nice to have" is explicit. Items added to scope after initial framing are flagged with rationale. |
| P6 | Non-goals | What the artifact explicitly will not address is stated and justified. Non-goals prevent scope creep and set expectations. If a related problem is deliberately excluded, the reader understands why without having to ask. |
| P7 | Assumptions surfaced | Assumptions are listed, not buried in prose or left implicit. Each assumption identifies what would change if it turned out to be wrong. Critical assumptions — those that would invalidate the problem framing if false — are flagged for validation. |
| P8 | Constraints identified | Regulatory, technical, organisational, timeline, and budget constraints that bound the solution space are explicit. The artifact doesn't leave the Solution author to discover constraints that were known during problem framing. |
| P9 | Impact and urgency | The cost or impact of the problem is quantified where possible — time lost, revenue at risk, users affected, manual effort consumed. Urgency is stated: why now, and what happens if this isn't addressed. The case for action is evidence-based, not assertion-based. |
| P10 | Existing alternatives considered | The artifact acknowledges whether this problem is already solved — by a vendor product, an internal tool, a manual workaround, or a competing initiative. If alternatives exist, the reason they're insufficient is stated. Building is not the default; it's justified. |
| P11 | Honest framing | The Problem reads honestly about what's broken, including awkward truths the author would have reason to soften. A stakeholder living with the problem would recognise their experience in the description. "Standards have drifted from convention" fails when the truth is "standards literally only existed in some developers' heads." Plausible-sounding sanitised prose fails. The artifact carries the messier version. |
| P12 | System purpose grounding | The Problem Statement establishes the system's reason-for-existing — who it serves, what for, what success looks like in operator / user terms — before stating implementation pain. Goals include at least one purpose-grounded outcome, not exclusively architecture-internal outcomes. A statement that opens with implementation pain ("X has structural issues, replace with Y") while all Goals are internal-architecture outcomes fails: read fresh, such an artifact is a self-referential rebuild exercise, not a problem worth solving. Satisfiable from the artifact alone — no external context needed. At Feature/Story scale, an explicit reference to the parent Epic's purpose satisfies the grounding. |
| P13 | Epic goal altitude | At Epic scope, every Goal describes success as observed by users, operators, or the business — not as codebase or architecture outcomes. Implementation-shaped goals ("single composite topic feeds display, log, and API", "controller is stateless across restarts") fail at Epic altitude even when purpose grounding (P12) is otherwise clean; they move to Feature scope, Tech Design, or the Overflow Log tagged with their destination — moved, not deleted. Applies at Epic scope only; at Feature and Story scale, goal altitude is governed by the parent chain and C13. |

**Note on P11.** In v1.2.x, P11 was "Implementation neutrality" — that criterion retires in v1.3.0 because its concern is subsumed by Core C13 (Implementation neutrality at the right altitude). The P11 slot is reused in v1.3.0 for **Honest framing** (above). Old and new P11 are different criteria; the migration file v1.2.0-to-v1.3.0 makes this explicit.

**Note on P12 / P13 (v2.0.0).** A paired floor and ceiling for Goals, both from the Hydroniq v3 burn (May 2026). P12 is the floor: at least one Goal is purpose-grounded — fail possible with zero technical content. P13 is the ceiling: at Epic scope, *no* Goal is implementation-shaped — fail possible even with perfect purpose grounding. Two distinct failure modes, two criteria.

## Assessment

The auditor assesses each criterion as **Pass**, **Partial**, or **Fail** with cited evidence from the artifact.

- **Pass** — the criterion is fully met with clear evidence.
- **Partial** — the criterion is partly met or the evidence is weak. The human directing the audit decides whether to accept or send back.
- **Fail** — the criterion is not met. This is classified as a Bug and must be fixed before the artifact advances.

**Assessing P12 / P13.** P12: Pass — the Statement opens with the system's reason-for-existing and at least one Goal is operator/user-facing. Partial — purpose is present but buried, OR Goals are exclusively architecture-internal despite purpose grounding in the Statement. Fail — the Statement opens with implementation pain and all Goals are internal-architecture outcomes. P13 (Epic scope): Pass — every Goal is observed by users, operators, or the business. Partial — a minority of Goals are implementation-shaped; each is flagged with its destination (Feature scope, Tech Design, or Overflow). Fail — Goals are predominantly implementation-shaped; the Problem reads as a project plan rather than a problem statement.

**Conditional sections (v1.3.0).** Root Cause Analysis (P4), Scope (P5), and Existing Alternatives (P10) are *conditional*. Pass accepts "either present and earned, or absent because not applicable to this problem." Absence of a conditional section is not a Fail. Presence of a conditional section without genuine content is a Bug (unearned ceremony). See template comments for inclusion triggers.

## When to Use

Apply the Problem Rubric when auditing:

- **Problem artifacts** at Epic, Feature, or Story scale
- **Combined documents** where the Problem section is included (e.g., a Feature-scale combined document covering Problem, Solution, and Tech Design, plus a separate Test Plan)

The Problem Rubric is always used **alongside the Core Rubric**. The Core Rubric covers universal quality (alignment, simplicity, trade-offs, etc.). The Problem Rubric covers what's specific to defining a problem well.

## Coherence Check

The Problem artifact is the start of the artifact stack. It has no preceding artifact to check against, but the auditor should verify that the problem as stated is consistent with any parent Epic problem when auditing at Feature or Story scale.
