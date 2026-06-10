<!--
TESTING ARTIFACT TEMPLATE

What this is:
  The Testing artifact answers: what behavioural assertions must hold
  for this system to work? It does not implement tests — it specifies
  what the running system must do (or never do). Implementation of the
  assertions is the coding session's job.

  Altitude test (apply to every assertion): "Could this assertion remain
  true if the implementation changed completely?" If yes, right altitude.
  If no, push to the coding session.

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
  Core Rubric (C1–C14) — applied to every artifact, cross-cutting.
  C13 (Implementation neutrality at the right altitude) is the cross-
  cutting altitude rule.

  Testing Rubric (T1–T9):
    T1 Behavioural coverage → Coverage Map
    T2 Traceability → Coverage Map
    T3 Scenario completeness → Behavioural Assertions
    T4 Exit criteria → Exit Criteria
    T5 Expected behaviour defined → Behavioural Assertions
    T6 Preconditions as state → Required State
    T7 Where assertions hold → Where Assertions Hold
    T8 Behavioural regression scope → Regression Scope
    T9 Risk-based prioritisation → Priority and Risk

Coherence check:
  The Testing artifact is audited against the Tech Design and the
  Solution. Every assertion traces to a requirement or constraint.
-->

# Testing: [title]

**Status:** DRAFT | REVIEW | ACCEPTED
**AIDOS Version:** 2.0.0
**Tech Design:** [link to Tech Design artifact]
**Solution:** [link to Solution artifact]

---

## Coverage Map
<!-- T1: Behavioural coverage. T2: Traceability. Every Solution goal and
     Tech Design constraint has at least one behavioural assertion. -->

| Requirement / Constraint | Source | Behavioural Assertion(s) | Coverage Gap? |
|---|---|---|---|
| [Goal from Solution] | Solution G1 | BA1, BA2 | |
| [Invariant from Tech Design] | Tech Design A4 | BA3 | |
| [Seam contract from Tech Design] | Tech Design A2 | BA4 | |

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
- [ ] Every Solution goal has at least one passing assertion
- [ ] No regressions in identified behaviours
- [ ] Assertions verified in their stated environment(s)

---

## Issues

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
