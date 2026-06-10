# Solution Rubric

Discipline-specific criteria for assessing Solution artifacts through the **Analysis lens**. This rubric checks whether the proposed response works as a coherent system — or whether it's a collection of ideas that haven't been thought through together.

---

## Criteria

| # | Criterion | What "Pass" Looks Like |
|---|---|---|
| S1 | Conceptual coherence | The solution holds together as a system. Everything works toward the same goal, with no internal contradictions or orphaned workflows. A reader can trace how the capabilities connect and why each exists. |
| S2 | Workflow completeness | Every user or system workflow is traced end to end. Entry points, decision points, handoffs, and exit points are explicit. No "and then the user does the obvious thing" gaps. The solution accounts for what happens at each step, not just the first and last. |
| S3 | Edge cases | Boundary conditions, unusual inputs, and atypical scenarios are identified and addressed — or explicitly deferred with rationale. The solution doesn't only describe the happy path. Where an edge case is out of scope, that's a deliberate statement, not an omission. |
| S4 | Minimum viable slice | The artifact identifies the smallest version that delivers real value. Scope is bounded — what's in, what's out, and why. The slice is viable (solves the stated problem at reduced scope), not just minimal (ships something small that doesn't actually help). |
| S5 | Alternatives considered | At least one alternative approach was evaluated and the reasoning for rejection is documented. The chosen solution isn't the default because it was the first idea — it's the choice because it's the best fit. "We considered doing nothing" counts if genuinely evaluated. |
| S6 | Dependency identification | External systems, teams, services, data sources, and decisions that the solution depends on are named. For each dependency, the current status is stated: available, committed, assumed, or at risk. Hidden dependencies are the ones that derail delivery. |
| S7 | Migration and transition | The path from the current state to the proposed solution is described. If users, data, or processes need to move, the transition approach is explicit. Cutover strategy, backward compatibility, and rollback are addressed where relevant. The solution doesn't assume a clean start. |
| S8 | Actor identification | Every person, team, system, or role that interacts with the solution is identified with their specific interactions described. The artifact is clear about who does what — not just what the system does. Where human action is required, frequency and skill expectations are stated. |
| S9 | Constraint compliance | The solution demonstrably respects the constraints identified in the Problem artifact — regulatory, technical, organisational, budget, and timeline. Where a constraint can't be fully met, the gap is acknowledged and the mitigation or trade-off is explicit. |
| S10 | Solution altitude discipline | The system under design appears in the Solution only as a single undivided actor. No sentence names an internal component, module, service, layer, or technical role of it — in any grammatical position, active or passive ("the setpoint is computed by the resolver" fails the same as "the resolver computes the setpoint"). The evaluation question for every sentence: could an observer who has never seen the code or the architecture evaluate whether this sentence is true? Users, business stakeholders, and external or pre-existing systems are legitimate actors (per S8). Where an interaction with an external system is a choice rather than a pre-existing fact, the outcome is stated ("the customer receives their invoice") and the mechanism is committed only as an explicit, justified workflow decision (S5 applies) — never as incidental phrasing. |

**Note on S10.** The S10 slot has carried two different criteria. The original "Implementation neutrality" retired in v1.3.0, subsumed by Core C13 — that concern (no *external* tools, vendors, schemas, libraries) still lives with C13. The slot is revived in v2.0.0 for **Solution altitude discipline**, which targets the *internal* form of implementation drift: component-named subjects ("the resolver", "the writer") that pass C13 cleanly while baking an implementation shape into the Solution. Triggered by Hydroniq v3 (May 2026), where a component-shaped Solution audited clean and the structural problem only surfaced deep into coding. Old and new S10 are different criteria; the migration file v1.4.0-to-v2.0.0 makes this explicit.

## Assessment

The auditor assesses each criterion as **Pass**, **Partial**, or **Fail** with cited evidence from the artifact.

- **Pass** — the criterion is fully met with clear evidence.
- **Partial** — the criterion is partly met or the evidence is weak. The human directing the audit decides whether to accept or send back.
- **Fail** — the criterion is not met. This is classified as a Bug and must be fixed before the artifact advances.

**Assessing S10.** Pass — every sentence survives the observer test; the system-under-design is one black box throughout. Partial — isolated component-shaped sentences; each is flagged for movement to Tech Design (if it captures a genuine architectural decision) or rewrite as an observable outcome (if the component name is incidental phrasing). Fail — the Solution is structured around internal components; every offending sentence is cited.

**Conditional sections (v1.3.0).** Alternatives Considered (S5), Constraint Compliance (S9), Migration and Transition (S7), and Scope Boundary (new in v1.3.0) are *conditional*. Pass accepts "either present and earned, or absent because not applicable to this solution." Absence is not a Fail; presence without genuine content is a Bug (unearned ceremony). See template comments for inclusion triggers.

**Scope Boundary (new).** When present, it states what this Solution is NOT — a responsibility boundary distinct from Non-Goals (which exclude features). Use when adjacent responsibilities could be confused with this one. Assessed under C1 (Alignment to goals) and S1 (Conceptual coherence) — not a standalone criterion.

## When to Use

Apply the Solution Rubric when auditing:

- **Solution artifacts** at Epic, Feature, or Story scale
- **Combined documents** where the Solution section is included (e.g., a Feature-scale combined document covering Problem, Solution, and Tech Design, plus a separate Test Plan)

The Solution Rubric is always used **alongside the Core Rubric**. The Core Rubric covers universal quality (alignment, simplicity, trade-offs, etc.). The Solution Rubric covers what's specific to designing a coherent response to the problem.

## Coherence Check

The Solution is audited against the **Problem artifact** that precedes it. The auditor verifies that the solution visibly solves the stated problem — every goal in the Problem has a corresponding response in the Solution, and nothing in the Solution addresses a problem that wasn't stated.
