<!--
TESTING ARTIFACT TEMPLATE

What this is:
  The Testing artifact answers: how do we verify it works and trace
  results back to requirements? It closes the artifact stack — every
  test traces backward through the Tech Design and Solution to the
  Problem's goals.

Rubric criteria:
  Core Rubric (C1–C13) — applied to every artifact. Core criteria are
  cross-cutting: you address them through the sections below. In particular:
    C1  Alignment to goals — every test traces to a requirement
    C2  Simplicity — test approach is proportionate to the risk
    C3  Explicit trade-offs — coverage gaps are justified
    C4  Failure modes — failure scenarios from upstream are tested
    C5  Testability — this artifact is the proof of testability
    C6  Observability — post-deployment verification is addressed
    C7  Security — security-relevant scenarios are tested
    C8  Operational impact — testing doesn't disrupt operations
    C9  Reversibility — test cleanup and data rollback
    C10 Future team readiness — tests are understandable and maintainable
    C11 Internal consistency — consistent structure and terminology
    C12 No duplication — reference requirements, don't restate them
    C13 Single unit of work — testing scope matches one deliverable

  Testing Rubric (T1–T9) — discipline-specific criteria:
    T1  Coverage → Coverage Map
    T2  Traceability → Coverage Map (requirement ↔ test mapping)
    T3  Scenario completeness → Test Scenarios
    T4  Exit criteria → Exit Criteria
    T5  Expected results defined → Test Scenarios (expected outcome)
    T6  Test data and preconditions → Test Data and Preconditions
    T7  Environment requirements → Environment Requirements
    T8  Regression awareness → Regression Scope
    T9  Risk-based prioritisation → Priority and Risk

Coherence check:
  The Testing artifact is audited against the Tech Design and the
  Solution. Every test case traces to a requirement in the Solution
  or a technical scenario in the Tech Design. No requirement exists
  without a corresponding test. No test exists without a corresponding
  requirement or design constraint. Deliberate gaps are stated and
  justified.

Scaling depth:
  Epic — Test Strategy. Coverage approach, environments, risk-based
  priorities. Detailed test cases live in Feature testing artifacts.
  Feature — Test Plan. Full test scenarios with expected results.
  This is the primary testing document.
  Story — consider using story.md instead. If you use this template,
  focus on the Coverage Map and Test Scenarios.
-->

# Testing: [title]

**Status:** NOT STARTED | DRAFT | STABLE | AUDITED
**Tech Design:** [link to Tech Design artifact]
**Solution:** [link to Solution artifact]

---

## Coverage Map
<!-- T1: Coverage. Every requirement and component has test coverage.
     T2: Traceability. Explicit mapping between requirements and tests. -->

| Requirement / Component | Source | Test Case(s) | Coverage Gap? |
|---|---|---|---|
| [Goal from Solution] | Solution G1 | TC1, TC2 | |
| [Component from Tech Design] | Tech Design | TC3 | |
| [Integration point] | Tech Design A2 | TC4 | |

## Test Scenarios
<!-- T3: Scenario completeness. Happy path, edge cases, error conditions,
     boundary values.
     T5: Expected results defined. Every test has a specific expected outcome. -->

### [Scenario group name]

| # | Scenario | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC1 | | | | | Must-pass / Should-pass |
| TC2 | | | | | |

### Error and Failure Scenarios

| # | Scenario | Trigger | Expected Behaviour | Priority |
|---|---|---|---|---|
| TC-E1 | | | | |

## Test Data and Preconditions
<!-- T6: Test data and preconditions. What data is needed, where it
     comes from, how it's set up and torn down. -->

| Data Set | Description | Source | Setup | Teardown |
|---|---|---|---|---|
| | | | | |

## Environment Requirements
<!-- T7: Environment requirements. What environments and infrastructure
     are needed to execute the test plan. -->

| Environment | Purpose | Dependencies | Available? |
|---|---|---|---|
| | | | |

## Regression Scope
<!-- T8: Regression awareness. What existing functionality could break.
     Proportionate to the blast radius of the change. -->

| Area | Risk | Regression Tests |
|---|---|---|
| | | |

## Priority and Risk
<!-- T9: Risk-based prioritisation. Must-pass vs should-pass.
     When time is short, the team knows what to run first. -->

**Must-pass (blocking release):**
- [Test cases that must pass before deployment]

**Should-pass (important, not blocking):**
- [Test cases that should pass but can be accepted with known risk]

## Exit Criteria
<!-- T4: Exit criteria. Specific, measurable conditions for "done."
     Beyond "all tests pass." -->

- [ ] [Coverage condition — e.g., all must-pass scenarios executed and passing]
- [ ] [Traceability condition — e.g., every Solution goal has at least one passing test]
- [ ] [Regression condition — e.g., no regressions in identified areas]
- [ ] [Environment condition — e.g., tested in staging with production-like data]

---

## Issues

| # | Source | Issue | Status |
|---|---|---|---|
| I1 | | | OPEN / SOCIALISE / ESCALATE / DEFERRED |

## Decisions

| # | Source | Issue | Resolution | Date |
|---|---|---|---|---|
| D1 | | | | |
