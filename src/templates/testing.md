<!--
TESTING ARTIFACT TEMPLATE

What this is:
  The Testing artifact is the strategy and the evidence standard — a
  judgement record of how we will know it works and what will be
  accepted as proof. It is not a script and not a test-case inventory.
  It does not implement tests; implementation is the job of the coding
  session.

  Per-item acceptance criteria are NOT held here. They are a projection
  of the Solution, the Tech Design, the team's standards and the code,
  curated onto the work item itself. Do not copy them into this file —
  that duplication is what drifts.

  Altitude test (apply to every assertion): "Could this assertion remain
  true if the implementation changed completely?" If yes, right altitude.
  If no, push to the coding session.

  This artifact is pulled forward by decisions taken elsewhere. Any
  decision — in this artifact or another — whose Test impact is anything
  other than "none" is the trigger to reconcile this file. The
  "Reconciled to" line in the header is where a reader checks whether
  that has happened.

Three depths, one template:
  Test Strategy (epic level):
    Behavioural assertions at system scope. Categories, priorities,
    where assertions hold. Individual assertions stay high-level.

  Test Plan (feature level):
    The primary testing document. Full depth across all sections.
    Behavioural assertions are concrete: Given/When/Then or invariants.

  Acceptance Criteria (story level):
    At least one behavioural assertion. "Inherits, nothing new" is NOT
    permitted — the story needs a checkable behavioural outcome.

Rubric criteria:
  Core Rubric (C1–C16) — applied to every artifact, cross-cutting.
  C13 (Implementation neutrality at the right altitude) is the cross-
  cutting altitude rule. C15 (Decision record integrity) and C16
  (Reconciliation currency) govern the Decisions section and the
  "Reconciled to" line.

  Testing Rubric (T1–T10):
    T1 Behavioural coverage → Coverage Map
    T2 Traceability → Coverage Map
    T3 Scenario completeness → Behavioural Assertions
    T4 Exit criteria → Exit Criteria
    T5 Expected behaviour defined → Behavioural Assertions
    T6 Preconditions as state → Required State
    T7 Where assertions hold → Where Assertions Hold
    T8 Behavioural regression scope → Regression Scope
    T9 Risk-based prioritisation → Priority and Risk
    T10 Evidence standard and independence → Evidence Standard

  The Auditor also runs a second readership pass (rubrics/readership.md,
  R1–R4) with its own verdict: can this survive being read by the people
  who must act on it.

Coherence check:
  The Testing artifact is audited against the Tech Design and the
  Solution. Every goal and every constraint has a stated approach to
  proving it; no part of the strategy exists without something upstream
  asking for it.
-->

# Testing: [title]

**Status:** DRAFT | REVIEW | ACCEPTED
**AIDOS Version:** 3.0.0
**Tech Design:** [link to Tech Design artifact]
**Solution:** [link to Solution artifact]
**Reconciled to:** [the decision this artifact is current as of, e.g. D14 — or "—" if none yet]
**Walked through:** [who explained this artifact back in their own words, and when — or "—" if not yet]

---

## Coverage Map
<!-- T1: Behavioural coverage. T2: Traceability. Strategy level: one row per
     Solution goal or Tech Design constraint, stating HOW it will be proven.
     Not a row per assertion — assertion-level detail is a projection onto the
     work item, not content this artifact holds. A goal or constraint
     deliberately left unproven is named here, with the reason. -->

| Goal / Constraint | Source | Approach to proving it | Gap or deliberate exclusion |
|---|---|---|---|
| [Goal from Solution] | Solution G1 | [e.g. "end-to-end assertion over the booking flow, run on every build against staging"] | |
| [Invariant from Tech Design] | Tech Design A4 | [e.g. "invariant asserted at the seam, run on every build"] | |
| [Seam contract from Tech Design] | Tech Design A2 | [e.g. "contract assertion owned by the consumer"] | |

## Evidence Standard
<!-- T10: Evidence standard and independence. What counts as proof, what does
     not, and who produces the independent check. An artifact that says what
     will be tested but never what will be accepted as proof fails T10. -->

**What counts as evidence.** Re-runnable beats static — a test or script in the repo that anyone can execute is evidence; a screenshot is a claim.

- [e.g. "a named test in the repo, executable by anyone with a checkout, against the stated environment"]
- [e.g. "a scripted check whose output is reproducible on demand"]

**What does not count.**

- [e.g. screenshots, verbal confirmation, "it worked on my machine", a one-off run nobody else can reproduce]

**Independent check.** Evidence produced by the same run that built the code is not an independent check.

| What is being proven | Who produces the independent check | Why it is independent |
|---|---|---|
| [Goal / constraint, or group] | [who — not the run that produced the code] | [e.g. "separate run, separate trigger, separate environment"] |

## Behavioural Assertions
<!-- T3: Scenario completeness. T5: Expected behaviour defined.
     Phrase as Given/When/Then or as invariants. Each has an explicit
     expected behavioural outcome two readers would agree on without
     seeing the code. -->

### [Group name]

| # | Given | When | Then (expected behaviour) | Priority |
|---|---|---|---|---|
| BA1 | | | | Must-hold / Should-hold |
| BA2 | | | | |

### Invariants (always or never)

| # | Invariant | Notes |
|---|---|---|
| BA-I1 | [e.g., "An unauthenticated request is refused, with no state change"] | |

### Failure scenarios

| # | Trigger | Expected behaviour | Priority |
|---|---|---|---|
| BA-F1 | | | |

## Required State
<!-- T6: Preconditions as state. Name the state each assertion requires
     at the same altitude as the assertion. No data shapes. -->

| State | Description | Applies to |
|---|---|---|
| [e.g., "a user with an active subscription"] | | BA1, BA3 |

## Where Assertions Hold
<!-- T7: Where assertions hold. Production / staging / integration / local
     — as a constraint on the assertion, not an infra spec. -->

| Assertion | Environment(s) | Why |
|---|---|---|
| BA1 | | |

## Regression Scope
<!-- T8: Behavioural regression scope. Existing behaviours that could be
     affected. Behaviours, not test files. -->

| Existing behaviour | Risk | Regression assertion |
|---|---|---|
| | | |

## Priority and Risk
<!-- T9: Risk-based prioritisation. -->

**Must-hold (blocking release):**
- [Behavioural assertions or groups that must hold before deployment]

**Should-hold (important, not blocking):**
- [Behavioural assertions or groups that should hold but can be accepted with known risk]

## Exit Criteria
<!-- T4: Exit criteria. Specific, measurable behavioural conditions. -->

- [ ] All must-hold assertions executed and holding
- [ ] Every Solution goal has a stated approach that has been carried out
- [ ] Evidence meets the standard above, and the independent check has been produced
- [ ] No regressions in identified behaviours
- [ ] Assertions verified in their stated environment(s)

---

## Issues

| # | Source | Issue | Status |
|---|---|---|---|
| I1 | | | OPEN / SOCIALISE / ESCALATE |

## Decisions

<!-- Decisions are numbered within this artifact. Where another artifact cites
     one, the citation names the artifact as well as the number ("Testing D3").

     The Test impact column exists because of this artifact. A decision
     anywhere in the estate whose Test impact is anything other than "none"
     changes what must be proven — that is the trigger to pull this artifact
     forward. Once reconciled, update the "Reconciled to" line in the header;
     that line is where a reader checks whether it has happened.

     A superseded decision stays in place, marked, with its reasoning intact.
     Never delete one. -->

| # | Decision | Basis | Test impact | Decided by | Date |
|---|---|---|---|---|---|
| D1 | [one line] | confirmed | none | [who] | [date] |

<!-- One detail block per decision. REQUIRED when Basis is "inferred" or
     "partly inferred", or when Test impact is anything other than "none". -->

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
findings only; the artifact's own history carries the record. Cleared once the
artifact is final (no open Bugs, no new findings on the latest pass).

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
