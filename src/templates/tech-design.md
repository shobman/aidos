<!--
TECH DESIGN ARTIFACT TEMPLATE

What this is:
  The Tech Design artifact answers: what is the architectural shape of
  the response? It names boundaries, where state lives, what crosses
  each seam at the kind level, what invariants must hold, what the
  failure posture looks like. It is deliberately upstream of code —
  the coding session decides how to implement these constraints.

  Altitude test (apply to every section): "Could this sentence only
  be written by someone looking at code?" If yes, the section has
  drifted past the architectural seam. Move it to the coding session.

Rubric criteria:
  Core Rubric (C1–C13) — applied to every artifact. Core criteria are
  cross-cutting: addressed through the sections below. C13 (Implementation
  neutrality at the right altitude) is the cross-cutting altitude rule.

  Tech Design Rubric (A1–A10) — discipline-specific criteria:
    A1  Boundary clarity → Boundaries
    A2  Seam contracts (kind, not shape) → Seam Contracts
    A3  State ownership and topology → State Ownership
    A4  Invariants → Invariants
    A5  Quality properties → Quality Properties
    A6  Failure and recovery posture → Failure and Recovery
    A7  Temporal stance → Temporal Stance
    A8  Trust zones → Trust Zones
    A9  Implementation handoff → Implementation Handoff
    A10 Transition strategy → Transition Strategy

Coherence check:
  The Tech Design is audited against the Solution artifact. Every
  boundary, contract, state owner, and invariant traces to something
  the Solution requires.

Scaling depth:
  Epic — full depth. Architecture-level. Every boundary and seam named.
  Feature — focused on this feature's architectural shape within the
  Epic architecture. Inherits Epic-level boundaries and invariants.
  Story — minimal. Often: "Inherits parent Tech Design. No new seams or
  contracts." This is an explicit Pass. When a story DOES touch
  architecture, name only the seam touched, the contract change if any,
  and the invariant preserved or extended.
-->

# Tech Design: [title]

**Status:** DRAFT | REVIEW | ACCEPTED
**AIDOS Version:** 1.0.0
**Solution:** [link to Solution artifact]

---

## Boundaries
<!-- A1: Boundary clarity. Name each major component / service / module /
     bounded context. State its ONE responsibility AND what it does NOT own.
     No overlapping responsibilities, no gaps. -->

| Boundary | Responsibility | Does NOT own |
|---|---|---|
| | | |

## Seam Contracts
<!-- A2: Seam contracts (kind, not shape). For each seam between boundaries,
     describe six things: kind (event/command/query/request-response/batch/
     stream), direction of trust, sync vs async, idempotency, delivery
     guarantee, semantic meaning of any value whose interpretation is not
     literal. NO wire formats, NO field names, NO schemas — those are
     coding-session decisions. -->

| Seam | Kind | Direction | Sync/Async | Idempotency | Delivery | Semantic notes |
|---|---|---|---|---|---|---|
| | | | | | | |

## State Ownership
<!-- A3: State ownership and topology. For each distinct KIND of state:
     who is the single writer; source of truth for the LIVE value
     (distinguished from historical query); justification vs the
     derived/queried alternative; directionality of any derived/cached/
     replicated relationship. NO storage technology, NO schemas. -->

| State (kind) | Single writer | Live source of truth | Justification (vs derived) | Derived/cached relationships |
|---|---|---|---|---|
| | | | | |

## Invariants
<!-- A4: Invariants. System-level properties that must always or never hold,
     in three categories: always-true, decision-precedence, sacred. Every
     new mechanism in this design must declare which invariant it preserves
     or extends — mechanisms without an invariant attached are a Bug. -->

**Always-true:**
- [e.g., "every order has exactly one charge"]

**Decision-precedence:**
- [e.g., "user twist > schedule override > schedule baseline > frost"]

**Sacred:**
- [e.g., "a user's dial twist is sacred within its TTL"]

## Quality Properties
<!-- A5: Quality properties. Latency / throughput / availability / scale
     as ARCHITECTURAL CONSTRAINTS with topology implications stated. Not
     bare numerical targets. -->

| Property | Constraint | Architectural implication |
|---|---|---|
| | | |

## Failure and Recovery
<!-- A6: Failure and recovery posture. For each major failure mode: what's
     tolerated, surfaced, healed automatically, operator-required. Decisions,
     not error-handling code. -->

| Failure mode | Tolerated | Surfaced | Auto-healed | Operator action |
|---|---|---|---|---|
| | | | | |

## Temporal Stance
<!-- A7: Temporal stance. For each significant flow: sync request, eventual
     consistency, scheduled batch, event-driven, polled. Deliberate vs
     default recorded. -->

| Flow | Time discipline | Deliberate or default? | Trade-off |
|---|---|---|---|
| | | | |

## Trust Zones
<!-- A8: Trust zones. Where security boundaries sit; what's trusted vs
     untrusted at each boundary; auth/identity propagation at the
     architectural level. "Not applicable" must be stated, not omitted. -->

[Trust zone description. Or: "Not applicable — single-tenant single-process system." with reason.]

## Implementation Handoff
<!-- A9: Implementation handoff. Three explicit sub-sections: what's
     constrained (must), what's left open (may — at least one named area),
     what's reversible vs locked-in (be careful). -->

**Constrained (the coding session must respect):**
- [boundary / contract / invariant / performance budget]

**Left open (the coding session chooses):**
- [at least one named area where the implementer chooses, justified by "this is a coding-session decision"]

**Reversible vs locked-in:**
- [public contracts, data formats, identifier schemes flagged when locking in]

## Transition Strategy
<!-- A10: Transition strategy. Only when transitioning from an existing
     system. Strangler / side-by-side / cutover / dual-write. "Greenfield,
     no transition" is a valid entry if applicable. -->

[Transition strategy description, or "Greenfield, no transition."]

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
