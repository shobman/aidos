# Testing Rubric

Discipline-specific criteria for assessing Testing artifacts through the **Quality lens**. This rubric checks whether the verification approach asserts **behaviour** — what must remain true about the system regardless of how it's implemented — rather than test-code mechanics.

**Altitude test:** *"Could this assertion remain true if the implementation changed completely?"* If yes, the assertion is at the right altitude. If no, push it to the coding session that implements the tests. See `framework.md` § Altitude Discipline.

---

## Criteria

| # | Criterion | What "Pass" Looks Like |
|---|---|---|
| T1 | Behavioural coverage | Every Solution goal and every Tech Design constraint (boundary, contract, state-ownership rule, invariant) has at least one behavioural assertion verifying it holds. Gaps are explicit and justified — "we chose not to assert X because Y" — not accidental omissions discovered later. |
| T2 | Traceability | Every assertion traces back to a requirement in the Solution or a constraint in the Tech Design. No orphaned assertions verifying things nobody asked for. No requirements without a corresponding assertion. The mapping is explicit, not implied. |
| T3 | Scenario completeness | Behavioural assertions cover happy path, edge cases, error conditions, and boundary values — expressed as behaviours (Given/When/Then, or invariants), not as test steps. Failure scenarios identified in upstream artifacts have corresponding assertions. |
| T4 | Exit criteria | The artifact defines what "done" looks like — specific, measurable behavioural conditions that must be met before the work is considered verified. Beyond "all tests pass": addresses behavioural coverage and confidence. |
| T5 | Expected behaviour defined | Every assertion has an explicit expected behavioural outcome two readers would agree on without seeing the code. "Verify the system handles it correctly" fails. "An unauthenticated request is refused with an authorisation error and no state change" passes. Specific HTTP codes, payload shapes, and tool/framework usage belong in the coding session that implements the test. |
| T6 | Preconditions as state | The **state** an assertion requires is named at the same altitude as the assertion. "A user with an active subscription" passes. "An INSERT into users(...) values(...)" fails — that's test-code mechanics. Data shapes belong in the coding session. |
| T7 | Where assertions hold | Every assertion states where it must hold (production, staging, integration, local). This is a constraint on the assertion, not an infrastructure spec. "Must hold against production data" is at the right altitude; "Requires Docker Compose with the test-fixtures profile" is not. |
| T8 | Behavioural regression scope | The artifact identifies which **existing behaviours** could be affected by this change and includes assertions to verify they still hold. Behaviours, not test files. Proportionate to the blast radius. |
| T9 | Risk-based prioritisation | Assertions are prioritised by risk and impact: must-hold (blocking release) vs should-hold (important, not blocking). When time is short, the team knows which assertions to verify first. |

## Assessment

The auditor assesses each criterion as **Pass**, **Partial**, or **Fail** with cited evidence from the artifact.

**The altitude self-check applies per criterion.** For every Pass assessment, the auditor verifies the assertion would survive a complete reimplementation (different language, different framework, different storage). If an assertion would NOT survive — e.g., it asserts a specific JSON field name or a specific tool's behaviour — the criterion drops to Partial and the artifact returns to the builder for altitude correction.

## When to Use

Apply the Testing Rubric when auditing:

- **Testing artifacts** (Test Strategy at Epic scale, Test Plan at Feature scale, Acceptance Criteria at Story scale)
- **Combined documents** where the Testing section is included

The Testing Rubric is always used **alongside the Core Rubric**. The Core Rubric (including C13 Implementation neutrality at the right altitude) covers universal quality; the Testing Rubric covers what's specific to asserting behaviour rather than implementing tests.

**Story-scale minimum.** At Story scale, Acceptance Criteria must include at least one behavioural assertion (Given/When/Then or invariant). "Inherits, nothing new" is permitted for Technical Approach (Tech Design at Story scale) but NOT for Acceptance Criteria — the story still needs a checkable behavioural outcome of its own.

## Coherence Check

The Testing artifact is audited against the **Tech Design** and the **Solution** that precede it. The auditor verifies that every behavioural assertion traces to a requirement in the Solution or a constraint in the Tech Design. No requirement exists without a corresponding assertion. No assertion exists without a corresponding requirement or design constraint. If a requirement is deliberately unasserted, the gap is stated and justified.

The coherence check also enforces altitude: assertions phrased in test-code terms (specific HTTP codes, payload shapes, tool/framework names) signal a coherence break — Testing has leaked past its altitude.
