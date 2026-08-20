# Testing Rubric

Discipline-specific criteria for assessing Testing artifacts through the **Quality lens**.

The Testing artifact is the **strategy and the evidence standard** — a judgement record of how we will know it works, what standard evidence must meet, and who is entitled to say it has been met. It is not a script, and it is not a test-case inventory.

**Per-item acceptance criteria are not content this artifact carries.** They are a projection of the Solution, the Tech Design, the team's standards and the code, curated onto the work item itself. Nobody authors them as a document. Holding them here duplicates what other artifacts already own, and duplication is what drifts.

This artifact is **pulled forward** by decisions taken elsewhere. A decision anywhere in the estate that changes what must be proven is the trigger to reconcile it; the artifact states the decision it is current as of. Currency is assessed by the Core Rubric (C16); this rubric assesses the strategy itself.

This rubric checks whether the verification approach asserts **behaviour** — what must remain true about the system regardless of how it's implemented — rather than test-code mechanics.

**Altitude test:** *"Could this assertion remain true if the implementation changed completely?"* If yes, the assertion is at the right altitude. If no, push it to the coding session that implements the tests. See `framework.md` § Altitude Discipline.

---

## Criteria

| # | Criterion | What "Pass" Looks Like |
|---|---|---|
| T1 | Behavioural coverage | Every Solution goal and every Tech Design constraint (boundary, contract, state-ownership rule, invariant) has at least one behavioural assertion verifying it holds. Gaps are explicit and justified — "we chose not to assert X because Y" — not accidental omissions discovered later. |
| T2 | Traceability | The strategy traces to the Solution's goals and the Tech Design's constraints. Every goal and every constraint is covered by a stated approach to proving it, and no part of the strategy exists without something upstream asking for it. Coverage is at the level of **what must be proven and how** — not a row per assertion. A deliberate gap is named and justified. A bidirectional per-assertion matrix is not required and is a duplication smell: assertion-level detail is a projection onto the work item, not content this artifact holds. |
| T3 | Scenario completeness | Behavioural assertions cover happy path, edge cases, error conditions, and boundary values — expressed as behaviours (Given/When/Then, or invariants), not as test steps. Failure scenarios identified in upstream artifacts have corresponding assertions. |
| T4 | Exit criteria | The artifact defines what "done" looks like — specific, measurable behavioural conditions that must be met before the work is considered verified. Beyond "all tests pass": addresses behavioural coverage and confidence. |
| T5 | Expected behaviour defined | Every assertion has an explicit expected behavioural outcome two readers would agree on without seeing the code. "Verify the system handles it correctly" fails. "An unauthenticated request is refused with an authorisation error and no state change" passes. Specific HTTP codes, payload shapes, and tool/framework usage belong in the coding session that implements the test. |
| T6 | Preconditions as state | The **state** an assertion requires is named at the same altitude as the assertion. "A user with an active subscription" passes. "An INSERT into users(...) values(...)" fails — that's test-code mechanics. Data shapes belong in the coding session. |
| T7 | Where assertions hold | Every assertion states where it must hold (production, staging, integration, local). This is a constraint on the assertion, not an infrastructure spec. "Must hold against production data" is at the right altitude; "Requires Docker Compose with the test-fixtures profile" is not. |
| T8 | Behavioural regression scope | The artifact identifies which **existing behaviours** could be affected by this change and includes assertions to verify they still hold. Behaviours, not test files. Proportionate to the blast radius. |
| T9 | Risk-based prioritisation | Assertions are prioritised by risk and impact: must-hold (blocking release) vs should-hold (important, not blocking). When time is short, the team knows which assertions to verify first. |
| T10 | Evidence standard and independence | The artifact states what counts as evidence, and the standard is **re-runnable rather than static**: a test or script in the repo that anyone can execute is evidence; a screenshot is a claim. It also states **who produces the independent check**, under the constraint that evidence produced by the same run that built the code is not an independent check. An artifact that describes what will be tested but never says what will be accepted as proof fails. |

## Assessment

The auditor assesses each criterion as **Pass**, **Partial**, or **Fail** with cited evidence from the artifact.

**The altitude self-check applies per criterion.** For every Pass assessment, the auditor verifies the assertion would survive a complete reimplementation (different language, different framework, different storage). If an assertion would NOT survive — e.g., it asserts a specific JSON field name or a specific tool's behaviour — the criterion drops to Partial and the artifact returns to the builder for altitude correction.

## When to Use

Apply the Testing Rubric when auditing:

- **Testing artifacts** (Test Strategy at Epic scale, Test Plan at Feature scale, Acceptance Criteria at Story scale)
- **Combined documents** where the Testing section is included

The Testing Rubric is always used **alongside the Core Rubric**. The Core Rubric (including C13 Implementation neutrality at the right altitude) covers universal quality; the Testing Rubric covers what's specific to asserting behaviour rather than implementing tests.

**Story-scale minimum.** At Story scale the artifact and the work item converge: the Story's Acceptance Criteria section *is* the projection written down, which is why it carries assertions where a Test Strategy or Test Plan does not. It must include at least one behavioural assertion (Given/When/Then or invariant). "Inherits, nothing new" is permitted for Technical Approach (Tech Design at Story scale) but NOT for Acceptance Criteria — the story still needs a checkable behavioural outcome of its own.

## Coherence Check

The Testing artifact is audited against the **Tech Design** and the **Solution** that precede it. The auditor verifies that every Solution goal and every Tech Design constraint has a stated approach to proving it, and that no part of the strategy exists without something upstream asking for it. Where a goal or constraint is deliberately unproven, the gap is stated and justified. The check is at strategy level: the auditor is not reconciling a row-per-assertion matrix, and should raise duplication where the artifact has become one.

The coherence check also enforces altitude: assertions phrased in test-code terms (specific HTTP codes, payload shapes, tool/framework names) signal a coherence break — Testing has leaked past its altitude.
