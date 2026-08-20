<!--
SOLUTION ARTIFACT TEMPLATE

What this is:
  The Solution artifact answers: what becomes possible, for whom, and who
  holds authority over it? It is the WHAT, in user and business language.
  It never names technology. It bridges the Problem (why the work is
  warranted) and the Tech Design (the consequential HOW).

Rubric criteria:
  Core Rubric (C1–C16) — applied to every artifact. Core criteria are
  cross-cutting: you address them through the sections below, not in
  separate sections. In particular:
    C1  Alignment to goals — every element traces to a Problem goal
    C2  Simplicity — simplest approach that solves the problem
    C3  Explicit trade-offs — choices are documented with reasoning
    C4  Failure modes — what can go wrong in the solution design
    C5  Testability — every design choice is verifiable
    C6  Observability — how you'd know if the solution is working
    C7  Security — security implications addressed
    C8  Reversibility — what's hard to undo
    C9  Future team readiness — no tribal knowledge
    C10 Internal consistency — consistent terminology
    C11 Cross-reference, never restate — the Solution is the only home of
        the WHAT; the Tech Design the only home of the HOW. Reference the
        Problem, don't restate it. A sentence describing mechanism fails
        here even when it reads cleanly
    C12 Single unit of work — one coherent solution
    C13 Implementation neutrality at the right altitude — Solution prose
        names no tools/vendors/schemas/libraries unless pre-existing constraints
    C14 Title altitude — the title states the problem being solved, not
        the part being built
    C15 Decision record integrity — decisions numbered, each carrying
        provenance, the evidence, what would falsify it, and the blast
        radius if wrong. Superseded decisions stay on the page, marked,
        reasoning intact — never deleted
    C16 Reconciliation currency — the artifact states the decision it is
        reconciled to, and every decision since carrying a test-impact or
        scope-impact flag has been addressed or explicitly deferred

  Solution Rubric (S1–S10) — discipline-specific criteria:
    S1  Conceptual coherence → Solution Thesis
    S2  Story independence and value → User Stories
    S3  Scenarios earn their place → Scenarios
    S4  Minimum viable slice → Minimum Viable Slice
    S5  Alternatives considered → Alternatives Considered
    S6  Dependency identification → Dependencies
    S7  Migration and transition → Migration and Transition
    S8  Actors and authority → Actors and Authority
    S9  Constraint compliance → Constraint Compliance
    S10 Solution altitude discipline → every section. The system is ONE
        black box: no sentence names an internal component, module,
        service, or technical role of it. Observer test: someone who has
        never seen the code can evaluate every sentence.

  Readership pass — after the rubric pass the Auditor runs a second,
  cheaper pass against rubrics/readership.md (R1–R4), with its own
  verdict. It asks only whether this artifact survives being read by the
  people who must act on it: readable in one sitting at its altitude,
  owning only what it owns, movement visible without diffing, and
  evidence that someone other than the author explained it back.

Coherence check:
  The Solution is audited against the Problem artifact. Every goal in the
  Problem has a corresponding response here. Nothing here addresses a
  problem that wasn't stated. If something in the Problem changed, this
  artifact reflects that change. The Problem Coverage section states the
  map explicitly: a Problem need with no story is a Bug, and a story with
  no Problem need behind it is a Bug.

Scaling depth:
  Epic — full depth. The solution is the system-level design.
  Feature — focused on this feature's response. Reference the Epic
  solution for context.
  Story — keep sections brief.

  All scales — the black-box rule (S10): internal components belong in
  Tech Design, not here. Watch passive voice.
-->

# Solution: [title]

**Status:** DRAFT | REVIEW | ACCEPTED
**AIDOS Version:** 3.0.0
**Problem:** [link to Problem artifact]
**Reconciled to:** [the decision this artifact is current as of, e.g. D14 — or "—" if none yet]

---

## Solution Thesis
<!-- S1: Conceptual coherence. A short description of the whole solution
     in one place: who directs it, what becomes possible, where authority
     remains. Everything works toward the same goal; a reader can trace
     how the capabilities connect and why each exists. This is the
     paragraph someone repeats back after reading the artifact once —
     if it takes a page, the solution isn't yet coherent. -->

[Who directs this solution, what becomes possible that wasn't before, and
where authority remains with people. Why this approach holds together as
one thing.]

## Scope Boundary
<!-- CONDITIONAL: include only when adjacent responsibilities could be
     confused with this one. The line that says "this is X, NOT Y" — a
     responsibility boundary distinct from Non-Goals (which exclude
     features). Use when readers might reasonably assume this Solution
     owns territory it doesn't. -->

[Statement of what this is NOT, beyond the Non-Goals list. Example: "This
solution covers notifying teams about deploy events. Acting on those
events — rollback, re-deploy, incident response — belongs to the existing
operations workflows. The two responsibilities are separate by design."]

## Actors and Authority
<!-- S8: Actors and authority. Who and what interacts with the solution,
     with frequency and skill expectations where human action is required.
     Then where authority sits: who may originate work, who makes the
     judgments, who performs execution, who accepts the outcome, and who
     closes the work. Name only the actors needed to understand the
     outcomes — not everyone adjacent to the team. -->

| Actor | Type | Interaction | Frequency |
|---|---|---|---|
| | Person / Team / System | | |

**Authority:**

- **Originates work:** [who may start it]
- **Judges:** [who makes the calls that can't be automated]
- **Executes:** [who performs the work]
- **Accepts:** [who decides the outcome is good]
- **Closes:** [who declares it done]

## User Stories
<!-- S2: Story independence and value. Every capability as an
     independently valuable user story. Number them. Title each by the
     user outcome, never by a component or an implementation task
     ("Approve a supplier before it can be traded", not "Supplier record
     writer"). Each story must be worth delivering on its own — a story
     that only makes sense delivered alongside three others is a
     fragment; collapse it or find the value it carries alone. The
     "so that" is real justification, not the capability restated. -->

### US1 — [outcome, in the user's words]

**As a** [person or role]
**I can** [capability]
**So that** [the valuable outcome — why this is worth having]

[Any further description the story needs. Keep it to what a reader needs
to judge whether the story is worth delivering.]

### US2 — [outcome, in the user's words]

**As a** [person or role]
**I can** [capability]
**So that** [the valuable outcome]

## Scenarios
<!-- S3: Scenarios earn their place. Boundary conditions, unusual inputs,
     and atypical scenarios belong here — including what used to be
     called edge cases. Use Given/When/Then ONLY where the behaviour or
     an authority boundary would otherwise be genuinely ambiguous: a
     branch, a threshold, a case where who decides isn't obvious. Where
     there is no branch to specify, plain prose is the better form.
     Forcing every story into Given/When/Then inflates detail without
     adding clarity and buries the scenarios that matter. Where a
     scenario is out of scope, say so deliberately — omission isn't a
     decision. -->

**[US1 — scenario name]**

> **Given** [the situation that makes the outcome ambiguous]
> **When** [what happens]
> **Then** [what the user or business sees, and who decided it]

**[US2 — prose scenario]**

[Where there's no branch, describe the boundary in a sentence. Example:
"Requests older than the retention window are unavailable; the requester
is told why rather than shown an empty result."]

**Out of scope:**

- [Scenario deliberately excluded — reason.]

## Problem Coverage
<!-- Coherence check, stated in the artifact rather than reconstructed by
     the reader. Each need in the Problem maps to the story or stories
     that answer it. A Problem need with no story is a Bug. A story with
     no Problem need behind it is a Bug — capability that entered because
     it seemed useful, not because the Problem called for it. -->

| Problem need | Answered by |
|---|---|
| [Problem G1 / the need in one line] | US1, US3 |

## Minimum Viable Slice
<!-- S4: Minimum viable slice. The smallest version that delivers
     real value. Viable, not just minimal. -->

**What's in the first slice:**
- [Story — traces to a Problem goal]

**What's deferred:**
- [Story — reason for deferral]

## Alternatives Considered
<!-- CONDITIONAL: include only when a genuine fork in the road was rejected
     with rationale. Omit when there was no real alternative (the obvious
     approach was the right one). -->
<!-- S5: Alternatives considered. At least one alternative evaluated.
     The chosen approach is justified, not just the first idea. -->

| Option | Description | Pros | Cons | Verdict |
|---|---|---|---|---|
| A — [chosen] | | | | **Selected** — [reason] |
| B | | | | Rejected — [reason] |

## Dependencies
<!-- S6: Dependency identification. External systems, teams, services,
     data sources, decisions. Status: available, committed, assumed, at risk. -->

| # | Dependency | Type | Status | Risk if Unavailable |
|---|---|---|---|---|
| DEP1 | | | | |

## Migration and Transition
<!-- CONDITIONAL: include only when there's a real cutover from a previous
     state. Omit for greenfield work. -->
<!-- S7: Migration and transition. How to get from current state to
     proposed state. Cutover, backward compatibility, rollback. -->

[Current state. Target state. How users, data, or processes move
from one to the other. What happens if the transition needs to be
reversed.]

## Constraint Compliance
<!-- CONDITIONAL: include only when external constraints actually bite the
     design. Omit when constraints are already implicitly satisfied. -->
<!-- S9: Constraint compliance. Map each constraint from the Problem
     to how this solution respects it. Flag gaps explicitly. -->

| Constraint | How Addressed | Gap? |
|---|---|---|
| [from Problem K1] | | |

---

## Issues
<!-- Source: where this issue was first identified — an artifact name, session, meeting, or external input. -->

| # | Source | Issue | Status |
|---|---|---|---|
| I1 | | | OPEN / SOCIALISE / ESCALATE |

## Decisions
<!-- C15: Decision record integrity. Decisions are numbered within this
     artifact. Where another artifact cites one, the citation names this
     artifact as well as the number. A superseded decision stays in
     place, marked, with its reasoning intact — never deleted. -->

| # | Decision | Basis | Test impact | Decided by | Date |
|---|---|---|---|---|---|
| D1 | [one line] | confirmed | none | [who] | [date] |

<!-- A detail block is REQUIRED when Basis is `inferred` or `partly
     inferred`, or when Test impact is anything other than `none`. -->

**D1 — [title]**
- **Rationale:** [why]
- **Basis:** confirmed | partly inferred | inferred — [the evidence it rests on]
- **Falsified by:** [what would show this is wrong]
- **Blast radius if wrong:** [what has to change]
- **Test impact:** none | [what must now be proven, and where]
- **Superseded by:** — | D[n]

## Auditor Notes

<!--
Populated by the AIDOS Auditor skill. Rewritten on each audit pass — latest
findings only; the artifact's own history carries the record. Cleared once the artifact is final (no
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
