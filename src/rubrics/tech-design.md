# Tech Design Rubric

Discipline-specific criteria for assessing Tech Design artifacts through the **Architecture lens**. This rubric checks whether the design is *architectural* — boundaries, state ownership, seam contracts at kind level, invariants, failure posture — rather than implementation-in-disguise.

**Altitude test:** *"Could this sentence only be written by someone looking at code?"* If yes, the artifact has drifted past the architectural seam and into the coding session's territory. See `framework.md` § Altitude Discipline.

---

## Criteria

| # | Criterion | What "Pass" Looks Like |
|---|---|---|
| A1 | Boundary clarity | Every major component, service, module, or bounded context is named with its ONE responsibility AND what it explicitly does NOT own. Boundaries don't overlap, and nothing falls between them. Could be drawn as a diagram with no orphaned arrows. |
| A2 | Seam contracts (kind, not shape) | Each seam contract is described as six things: (a) **kind** (event, command, query, request/response, batch, stream); (b) **direction of trust** (who initiates, who is authoritative); (c) **sync vs async**; (d) **idempotency** expectation; (e) **delivery guarantee** (at-most-once / at-least-once / exactly-once); (f) **semantic meaning** of any value whose interpretation is not literal (e.g., 'window-state True = closed' is interpretation, not literal data — pin it). Wire formats, exact field names, schemas, retention configs belong in the coding session. Altitude check: if a sentence here could be a Z2M / MQTT / REST manual quote, it's the wrong altitude. |
| A3 | State ownership and topology | Every distinct **kind of state** in the system has: (a) a named **single owner** — exactly one writer; (b) a stated **source of truth for the live (current) value**, distinguished from historical query (logs are historical, not live); (c) a **justification for being state at all** — what derived/queried alternative was considered and why it was rejected; (d) explicit **directionality** for any derived / cached / replicated relationship (no co-equal copies). Storage technology, table shapes, field names, retention configs are absent. The reader can answer: 'if state X disagrees between two places, who do I trust?' |
| A4 | Invariants | System-level properties that must always or never hold are named explicitly in three categories: (a) **always-true** (e.g., 'every order has exactly one charge'); (b) **decision-precedence** orders when multiple inputs could drive the same behaviour (e.g., 'user twist > schedule override > schedule baseline > frost'); (c) **sacred** operations that automation must not override (e.g., 'a user's dial twist is sacred within its TTL'). Implementation chooses how to enforce them; this rubric checks they're stated. A new mechanism added to the design must declare which invariant it preserves or extends — mechanisms with no invariant attached are a Bug. |
| A5 | Quality properties | Latency, throughput, availability, and scale envelope are stated as **architectural constraints with their implication for topology** spelled out, not as bare numerical targets. "Sub-second p99 → no synchronous chain across services" is a quality property; "must be fast" is not. Where the architecture must scale, the scaling approach is named. Where it doesn't, the assumption is explicit with the threshold at which it breaks. |
| A6 | Failure and recovery posture | For each major failure mode (component down, network partition, dependency timeout, data corruption, message loss), the artifact states what the system tolerates, what it surfaces, what it heals automatically, and what requires operator action. Decisions, not error-handling code. "Handle errors gracefully" fails; "On dependency timeout, return last-known-good with a staleness header; operator alerted after N consecutive failures" passes. |
| A7 | Temporal stance | For each significant flow, the time discipline is named: synchronous request, eventual consistency, scheduled batch, event-driven, polled. If the choice is deliberate (vs default), the trade-off is recorded. Default-everything-to-synchronous-because-that's-how-code-reads is a Bug. |
| A8 | Trust zones | Where security boundaries sit — between users, tenants, services, network segments. What's trusted vs untrusted at each boundary. Auth and identity propagation are described at the architectural level (delegated? federated? token-passing? mutual-trust?). Specific auth implementations belong in the coding session. "Not applicable for single-tenant single-process systems" is a valid Pass if stated and justified. |
| A9 | Implementation handoff | The artifact explicitly names three things the coding session needs: (a) what's **constrained** (must — boundaries, contracts, invariants, performance budgets the implementation must respect); (b) what's **left open** (may — at least one named area where the implementer chooses, justified by "this is a coding-session decision"); (c) what's **reversible vs locked-in** (be careful — public contracts, data formats, identifier schemes, persistence shapes flagged when locking in). A Tech Design that names zero "left open" areas has overstepped into implementation. A Tech Design that pre-decides *how to detect* a behaviour rather than *what the behaviour must be* is overreach. |
| A10 | Transition strategy | When transitioning from an existing system, the **architectural strategy** is named: strangler, side-by-side, cutover, dual-write. The artifact answers "what's the architectural path from here to there?" rather than letting the existing code shape the answer. "Greenfield, no transition" is a valid Pass if stated. |

## Assessment

The auditor assesses each criterion as **Pass**, **Partial**, or **Fail** with cited evidence from the artifact.

- **Pass** — the criterion is fully met with clear evidence.
- **Partial** — the criterion is partly met or the evidence is weak. The human directing the audit decides whether to accept or send back.
- **Fail** — the criterion is not met. This is classified as a Bug and must be fixed before the artifact advances.

**The altitude self-check applies per criterion.** For every Pass assessment, the auditor verifies that no sentence in the evidence could only be written by someone looking at code. If yes — even for an otherwise valid Pass — the criterion drops to Partial and the artifact returns to the builder for altitude correction.

## When to Use

Apply the Tech Design Rubric when auditing:

- **Tech Design artifacts** at Epic, Feature, or Story scale
- **Combined documents** where the Tech Design section is included (e.g., a Feature-scale combined document covering Problem, Solution, and Tech Design, plus a separate Test Plan)

The Tech Design Rubric is always used **alongside the Core Rubric**. The Core Rubric (including C13 Implementation neutrality at the right altitude) covers universal quality; the Tech Design Rubric covers what's specific to authoring an architectural design that lives upstream of code.

**Story-scale latitude.** At Story scale, Technical Approach may say *"Inherits parent Tech Design. No new seams or contracts."* and stop — this is an explicit Pass, not a Fail. Forcing architectural content where there isn't any is the same disease in reverse. Story-scale subset for Tech Design is A1, A2, A4 (which seam this story touches; contract change if any; invariant preserved or extended).

## Coherence Check

The Tech Design is audited against the **Solution artifact** that precedes it. The auditor verifies the architectural shape implements the Solution's response — every named boundary, seam contract, state owner, and invariant traces to something the Solution requires. Conversely, nothing in the Solution is left unaddressed without explicit justification.

The coherence check also enforces seam discipline: implementation decisions visible in the Tech Design that should be in the coding session (specific schemas, function signatures, framework choices) signal a coherence break — the architecture has leaked past its altitude.
