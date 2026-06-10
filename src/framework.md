# AI Delivery Operating System

*Named for Aidos (αἰδώς) — the ancient Greek spirit of restraint, modesty, and respect. The force that holds you back from acting without thinking.*

---

## Purpose

AI has dramatically lowered the cost of producing first-pass artifacts, prototypes, and implementation. A spec that took a sprint can be drafted in an afternoon. A feature that took a team can be prototyped by one person with an agent.

But the thinking hasn't got cheaper. Understanding the problem, aligning stakeholders, and making judgment calls — that's as slow and expensive as it ever was. And when implementation is fast, bad assumptions compound faster too.

AIDOS exists to improve decision quality before implementation speed compounds mistakes. It is an AI-era delivery assurance framework: a structured way to think, decide, and verify before you build — and to keep verifying as you go.

---

## AIDOS at a Glance

```
┌─────────────────────────────────────────────────────────┐
│                    ARTIFACT STACK                        │
│                                                         │
│   Problem ──→ Solution ──→ Tech Design ──→ Testing      │
│                                                         │
│   Each artifact is checked against its own rubric       │
│   AND against the artifact before it.                   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   BUILDER          creates artifacts with AI assistance │
│   AUDITOR          reviews against rubrics + coherence  │
│                    (never the same person)               │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   RUBRICS          Pass / Partial / Fail with evidence  │
│   ISSUES           tracked inline, escalated with       │
│                    decision packets                      │
│   DECISIONS        captured with rationale and date     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   RHYTHM           sprint → park → align → feed back    │
│   IMPROVEMENT      retrospectives harden the rubrics    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Minimum viable adoption:** one artifact, one rubric, separate builder and auditor, explicit issue and decision capture. You can adopt AIDOS incrementally — start with the Problem artifact and the Core Rubric, and expand from there.

---

## Core Model

### The Artifact Stack

Every delivery progresses through four questions:

| Artifact | Question | Lens |
|---|---|---|
| **Problem** | What is happening, for whom, why it matters, and what success looks like | Product |
| **Solution** | How the proposed response works as a system, including options and trade-offs | Analysis |
| **Tech Design** | The architectural shape of the response — boundaries, seam contracts, state ownership, invariants, failure posture | Architecture |
| **Testing** | How we verify it works and trace results back to requirements | Quality |

These are delivery artifacts — living documents that build on each other progressively. When new information arrives, it flows backward too — a discovery during Tech Design might reshape the Solution.

### The Coherence Rule

Each artifact is audited against its own quality rubric **and** against the artifact that precedes it.

The Solution must visibly solve the Problem. The Tech Design must implement the Solution. The Testing must verify the Tech Design against the Solution's goals. If the chain breaks, you find out during a review — not in production.

This isn't bureaucracy. It's traceability. When something goes wrong, you can trace backward through the chain. It either holds or it breaks at an identifiable point.

**Change Request or implementation detail?** Problem-anchored artifacts make this distinction literal: *did the problem statement change?* If no — however large the rewrite — it's implementation detail, not a Change Request. Implementation-anchored artifacts collapse the distinction and turn every approach pivot into apparent scope creep. This is one of the most concrete daily payoffs of altitude discipline.

### Altitude Discipline

AIDOS is for the thinking that happens before the code. Each artifact has an altitude beyond which it must not drift, because the coding session is better placed to decide what lies past it. Three altitude tests anchor the discipline:

- **Problem and Solution altitude test:** *"Could a sentence here name a specific tool, vendor, schema, library, or framework?"* If yes, it's implementation drift — capture in the Overflow Log tagged for Tech Design.
- **Tech Design altitude test:** *"Could this sentence only be written by someone looking at code?"* If yes, it's the wrong altitude — push to the coding session.
- **Testing altitude test:** *"Could this assertion remain true if the implementation changed completely?"* If yes, it's the right altitude. If no, push to the coding session.

These tests are referenced from Core C13 (Implementation neutrality at the right altitude), from the Tech Design rubric, and from the Testing rubric. One discipline, applied at three checkpoints.

### Tech Design is Direction

Tech Design is **direction** — one concept, not "hard constraints" plus "suggestions" as separate registers. The architect writes just enough to get the build started right: decisions, boundaries, invariants, starters. Devs read it and either follow it or push back. Architect-approved pushback updates the direction — the artifact moves, the record stays. Depth varies by project, team, and who's building; "just enough to get started" is the bar, not a rubric tier.

At Epic scale, Tech Design is a separate, mandatory document — and it may drop into implementation guidance to give developers a head start. That's allowed, not a defect. Below Epic, Tech Design is **optional**: included at the architect's discretion, with the reasoning recorded either way — one line is enough (see Scaling).

### Builder / Auditor Separation

AIDOS depends on separation between artifact creation and artifact audit. The same person cannot be both builder and final judge.

**Builder** — creates and modifies artifacts. The builder holds the pen. A human directs the work, provides context and decisions. AI assists with drafting, structuring, and refining. The builder captures everything: decisions, assumptions, issues, trade-offs. If it happened in the session, it goes in the artifact.

**Auditor** — reviews artifacts against rubrics and checks coherence with the preceding artifact. The auditor does not fix problems — they identify them and send findings back to the builder. Findings are classified as:

- **Bug** — must fix before proceeding. Something is wrong, missing, or contradictory.
- **Risk** — decision required. The human decides: accept, mitigate, or defer.
- **Idea** — noted, not actioned unless chosen. Ideas do not drive additional audit passes.

**The three-pass rule.** Pass 1 is the full assessment. Pass 2 re-audits only the criteria that failed. Pass 3 is the final attempt. After three passes, repeated failure usually signals a structural issue upstream — a flawed assumption or decision in a preceding artifact — not a local drafting problem. Escalate up the stack.

### Rubrics

Every artifact is assessed against two rubric layers:

**Core Rubric** — universal criteria that apply to every artifact at every scale. Alignment to goals. Simplicity. Explicit trade-offs. Failure modes. Testability. Observability. Security. Reversibility. Future team readiness. Internal consistency. No duplication. Single unit of work. Implementation neutrality at the right altitude. Title altitude.

**Discipline Rubric** — criteria specific to each artifact type. The Problem rubric (P1–P13) checks clarity, stakeholders, measurability, root cause confidence, scope, non-goals, assumptions, constraints, impact, existing alternatives, honest framing, purpose grounding, and Epic goal altitude. The Solution rubric (S1–S10) checks conceptual coherence, workflow completeness, edge cases, minimum viable slice, alternatives, dependencies, migration, actors, constraint compliance, and altitude discipline. The Tech Design rubric (A1–A10) checks boundaries, seam contracts, state ownership, invariants, quality properties, failure and recovery posture, temporal stance, trust zones, implementation handoff, and transition strategy. The Testing rubric (T1–T9) checks behavioural coverage, traceability, scenarios, exit criteria, expected behaviour, preconditions as state, where assertions hold, behavioural regression scope, and risk-based prioritisation.

Each criterion has a defined "what pass looks like." The auditor assesses Pass, Partial, or Fail with cited evidence. The evidence requirement is what gives rubrics teeth — you can't hand-wave a Pass. Partials are accepted or rejected by the human directing the audit, not waved through. The artifact doesn't advance until bugs are fixed.

**Auditor Notes section.** Each artifact has an `## Auditor Notes` section at its bottom — a structured home for the Auditor's per-pass findings, classified as Bug / Risk / Idea. The section is rewritten by the Auditor each pass (latest findings only; git carries the history). This is what makes the autonomy loop work — sub-agents in different sessions cannot read each other's chats, so findings must persist with the artifact.

Full rubric definitions are in `src/rubrics/`.

### The Artifacts Are the Interface

The artifacts are the interface between people, between sessions, and between humans and AI. If it's not in the document, it doesn't exist for the next consumer — whether that consumer is a colleague, a coding agent, or your future self resuming work next week.

This is especially important for AI-assisted work, where sessions are transient. The artifact is what persists. Everything else is conversation that disappears.

---

## Scaling

Not every piece of work needs the full stack at every level of detail.

**Epic** — a large initiative spanning multiple sprints and people. Problem, Solution, Tech Design, and Test Strategy are each a separate document, plus an Issues Log and an Overflow Log. Every artifact gets thorough treatment because the cost of getting them wrong is high and many people depend on them.

**Feature** — a specific deliverable, one to two sprints, typically one builder. Problem, Solution, and Tech Design are combined into one document. Testing is a separate Test Plan. An Overflow Log is optional — overflow items can go into the parent Epic's log or be tracked inline. If a Feature has no parent Epic, it needs its own Overflow Log. The Problem section can be lightweight if the Epic Problem is strong. The Tech Design section is **optional** — included at the architect's discretion as direction (see Tech Design is Direction). Include it only when its absence would make a wrong implementation plausible; record the architect's reasoning either way — one line is enough. One mechanical floor: a Feature whose Stories share any seam (a cache API, an event format, a shared contract) must include Tech Design — it is the only place context-isolated Story work can read cross-Story contracts from. The coding session owns its own implementation brief.

**Story** — a day or less of work. Everything lives in a single document. Lean artifacts that inherit heavily from the parent feature. Overflow goes into the parent Feature's Overflow Log, not a separate document. At story scale, the artifacts compress enough that their form changes, so they take different names: Problem becomes Context, Solution becomes User Story, Tech Design becomes Technical Approach, and Testing becomes Acceptance Criteria. Technical Approach is optional on the same recorded-discretion terms as the Feature Tech Design section. They map directly to the four artifact types and are still assessed against the same rubrics at lighter depth.

| Artifact | Epic | Feature | Story |
|---|---|---|---|
| Problem | Problem (full depth) | Problem (focused) | Context |
| Solution | Solution (system-level) | Solution (feature-scope) | User Story |
| Tech Design | Tech Design (direction — architecture) | Tech Design (direction, optional) | Technical Approach (direction, optional) |
| Testing | Test Strategy | Test Plan | Acceptance Criteria |

### Document Structure by Scale

The scale of the work determines the document structure. This is not a suggestion — the builder does not choose how to split artifacts.

| Scale | Document Structure |
|---|---|
| **Epic** | 4 separate documents (Problem, Solution, Tech Design, Test Strategy) + Issues Log + Overflow Log. |
| **Feature** | 1 combined document (Problem + Solution + optional Tech Design — the slot is never silently absent: it carries content or a one-line recorded omission) + 1 separate Test Plan. |
| **Story** | 1 document containing everything. |

### Artifact Naming

At Epic and Feature scale, Problem, Solution, and Tech Design keep their names — the depth changes, but the form doesn't. Testing renames at both scales (Test Strategy at Epic, Test Plan at Feature) because it genuinely changes form at each level.

At Story scale, all four artifacts compress enough that they become something different in kind, not just in depth. They take familiar names that reflect their compressed form: Context, User Story, Technical Approach, Acceptance Criteria. The rubrics still apply — the mapping is one-to-one — but the names signal that the builder should think in the compressed form, not try to write a shallow version of the full artifact.

The templates in `src/templates/` provide maximum structure. The builder scales down based on the work — keeping sections brief or skipping them, not switching to a different template. (One named exception: the Feature/Story Tech Design slot is never skipped silently — it carries content or a one-line recorded omission.) A one-line Assumptions section is better than no Assumptions section.

Scale determines document structure; which artifacts to instantiate is always a human judgment call.

Use judgment. A solo developer building a well-understood API might only need a Problem and a Tech Design. A complex multi-team initiative needs the full stack at epic and feature scale. The framework provides the structure; the human decides how much to use.

### .aidos/ Convention

An AIDOS project root is identified by a `.aidos/` folder. This is where artifacts live. The folder can sit at a repo root, inside a monorepo package, or anywhere the user needs to anchor their delivery work.

Git is the source of truth. Artifacts are authored, committed, and reviewed through the repository — the same way as code. Publishing to other systems (Confluence, GitHub Pages, etc.) is optional and outbound. The `.aidos/` folder and the repo's version history are the canonical record.

Delivery artifacts live in the `.aidos/` folder and stay current as the feature evolves — they are the long-term record. No archive convention.

---

## Decomposition and Fan-out

For Epic-scale work, AIDOS provides two additional skills beyond Builder and Auditor:

- **`aidos-breakdown`** — interactive scaffolding skill that takes approved Epic-scope Problem + Solution (or Feature-scope `feature.md`) and produces a decomposition into Features and Stories as filesystem stubs, each with a TL;DR and Breakdown Context section. Audited against the Breakdown Rubric (`rubrics/breakdown.md`). The filesystem layout IS the breakdown — no separate manifest.
- **`aidos-fanout`** — coordinator skill that dispatches sub-agents to fill out the stubbed Feature and Story artifacts. Two-phase at Epic scope (Features first, then Stories); single-phase at Feature scope. Sub-agents are context-isolated and run the autonomous Builder → Auditor → fix loop internally, capped at the three-pass rule.

Both skills run in Claude Code, where sub-agent dispatch primitives exist. PM/PO workflows for upstream artifact authoring continue to work in Claude.ai with the AIDOS Skill + GitHub MCP Connector; the BA persona drives breakdown and fan-out in Claude Code.

Decomposition is not project management. The Breakdown Rubric audits shape (independence, coverage, boundary clarity, sizing-shape, feature scope, title altitude, feature coherence, dependencies) — not estimation, sequencing, or rollout. Those concerns belong to the team's PM system (Jira, Linear, etc.), not to AIDOS.

---

## Issues and Decisions

Artifacts accumulate issues and decisions as they're built.

**Issues** are open questions, risks, or unknowns. They're tracked inline in the artifact with status: OPEN, SOCIALISE (needs discussion), or ESCALATE (needs stakeholder decision). Issues are closed by moving them to the Decisions table with resolution, who decided, and date.

**Decisions** are resolved issues. When an issue resolves, it moves from the Issues table to the Decisions table with rationale and date. Decisions don't disappear — they're the audit trail.

**Decision Packets.** When an issue needs escalation, it gets packaged with: the options available, a recommendation, downstream impact, and who needs to decide. This means a stakeholder can make an informed call without re-reading the entire artifact.

**Issues Log.** Escalated items are copied to a centralised Issues Log that tracks what's waiting for a decision across the project and what's been decided. This prevents decisions from getting lost in meeting notes and Slack threads.

**Overflow Log.** Content captured during sessions that can't yet be placed in an artifact — ideas, concerns, design fragments, edge cases that surfaced at the wrong time. Each item is tagged with a probable destination and a status: PARKED (active, waiting), HARVESTED (placed in an artifact or scaffolded), DISCARDED (intentionally killed, rationale recorded), or BACKLOG (out of scope for this iteration, may return). A project cannot close with PARKED items remaining — they must be harvested, discarded, or moved to the backlog.

---

## Working Rhythm

AIDOS introduces a pulse-based working rhythm inside whatever broader planning cadence the team uses — sprints, Kanban, or ad hoc project cycles.

1. **Sprint** — the builder works with AI to create or advance an artifact. Fast, focused, captured.
2. **Park** — the artifact is committed, status updated, ready for review. The builder moves to the next piece of work.
3. **Align** — humans review, react, decide. Meetings happen when they're needed.
4. **Feed back** — meeting outcomes flow into the next builder session. Decisions and corrections are processed with AI in minutes.
5. **Sprint again** — the next artifact or the next iteration, informed by everything that just happened.

The artifacts preserve state across parallel work. When Project A is parked waiting for stakeholder review, you sprint on Project B. The framework ensures nothing is lost in the switch.

### Who Can Build

AI has expanded who *can* draft artifacts — that doesn't change. A developer can frame a Problem. An analyst can spike a prototype. The framework reduces dependence on role-based document production, but not on role-based judgment.

What AIDOS now names is the default pattern that keeps artifacts at problem altitude: **a Business Analyst — or whoever wears the analyst hat — holds the pen, writing after interviewing the architect or lead. The architect steps in directly when needed. Devs review and push back.** The BA is a hat, not a headcount: a solo builder switches hats deliberately — frame the problem as the analyst, then design as the architect, and notice which one is writing. The pattern exists because "whoever opens the AI session" defaults to developer-flavored artifacts, and developer-flavored artifacts bake the implementation into the spec.

**Dev pushback is the system working.** Two outcomes are both fine: devs accept the direction (the architect's judgment held), or devs push back and the direction updates (devs are thinking like architects). The wrong outcome is silent compliance. Pushback on Tech Design is the everyday vehicle by which developers build the architect muscle — it is encouraged, expected, and recorded in the artifact when it lands.

The counter-risk is real: AI enables people to produce plausible first passes outside their specialty, which can create false confidence. That's exactly why the auditor role exists. Anyone can build. But the work must survive a structured audit by someone who didn't create it.

---

## Methodology Fit

AIDOS provides artifact structure and quality standards that work regardless of how you organise delivery.

**When upfront specification works** — the domain is well-known, the decision-maker is one person, the output is for machines to execute — a detailed spec handed to an AI coding agent is effective. Go deep on Problem and Tech Design, minimise iterative checkpoints.

**When iteration is essential** — the output is for humans to interact with, multiple stakeholders need to align, you won't know if it's right until someone sees it — short cycles with frequent feedback are essential. Light Problem, spike fast, show early, iterate.

**Most real work is a mix.** The artifacts and rubrics don't change — only the rhythm and the number of human checkpoints.

The calibration questions at the start of a project:

- How many decision-makers are involved?
- How well-understood is the domain?
- Is the output for humans to interact with or machines to execute?
- How reversible is a wrong choice?
- Does anyone own the outcome?

---

## Rubric Evolution

Rubrics encode lessons from experience. A criterion like "operational ownership is identified and accepted" exists because someone got six weeks into a project and discovered nobody would own the result.

The improvement loop:

1. **Retrospective** — the team identifies what burned them.
2. **Builder session** — a proposed rubric amendment is drafted. New criteria, modified pass conditions, or criteria to retire.
3. **Auditor session** — the proposed changes are reviewed. Are they testable? Non-redundant? Do they actually address the pain point?
4. **Merge** — approved changes enter the rubric with a changelog entry recording what changed, why, and which project drove it.

A good rubric criterion is testable (two people could independently assess Pass, Partial, or Fail and mostly agree), non-redundant (it catches something no other criterion covers), grounded (it comes from real delivery pain), and actionable (if it fails, the builder knows what to fix).

---

## What AIDOS Is Not

AIDOS is a thinking-and-assurance layer. It does not replace:

- **Product strategy** — deciding what to invest in
- **Engineering standards** — coding conventions, architecture patterns, CI/CD
- **Team structure** — how people are organised
- **Backlog or project tools** — Jira, Linear, GitHub Issues, Trello
- **Incident management** — what happens when things break in production
- **Delivery planning** — capacity, timelines, dependencies

It sits alongside those things. The artifacts feed into your planning tools. The rubrics complement your engineering standards. The audit process works with whatever review culture you already have.

### What AIDOS Does NOT Contain

Even when a session feels like it should produce one of these, push it elsewhere. They have homes that aren't AIDOS artifacts.

| Thing | Lives where |
|---|---|
| Sprint shape (owners, dates, branch strategy, parallel execution) | Tickets / sprint planning / channel kickoff message |
| Project management (timelines, capacity, dependencies, status reports, RAID logs) | Your project tool — Jira, Linear, ADO, etc. |
| Implementation design (schemas, function shapes, library choices, deployment infra) | Coding session (Super Powers plan/spec phase) |
| Test code | Coding session, satisfying the AC |
| Daily progress notes | Channel updates, standups |
| Code review feedback | PRs |

AIDOS captures the thinking BEFORE the code and the assurance ALONGSIDE it. It does not duplicate sprint mechanics, project management ceremony, or implementation work. If a session is drifting into these, name it and push it out.

---

## For AI Agents

At Epic scale, the Tech Design artifact is the architectural envelope for everything beneath it. Boundaries, seam contracts (at kind level), state ownership, invariants, failure posture, trust zones, implementation handoff — all explicit. An AI agent receiving an Epic Tech Design that passed audit has the envelope that most developers would spend days building up through conversation and code archaeology, while still owning the implementation decisions inside it. Below Epic, Tech Design is direction and may be deliberately absent — the agent reads the artifact chain and the recorded discretion, and the coding session owns its own implementation brief.

The full artifact chain — Problem through Solution through Tech Design — gives an agent something rare: *why* the code exists, not just what it should do. When an agent understands the Problem, it makes better implementation decisions. When it can reference the Solution, it resolves ambiguities without asking.

### Agent Autonomy Spectrum

The rubric-based quality model is deliberately agent-agnostic. The artifact stack, the coherence chain, and the builder/auditor separation work the same way whether both roles are human-directed, AI-driven with human oversight, or fully autonomous.

This isn't a future aspiration — it's a current design property. The rubrics define the quality bar. The audit checks against it. The three-pass rule and escalation mechanism are the safety valves. None of these depend on a human being in the loop for every pass. They depend on the rubric criteria being precise enough to assess consistently.

What changes across the spectrum is who initiates the forward pass, how much human oversight each pass gets, and the precision required from rubric criteria. At the human-directed level, a vague criterion is survivable — the human compensates. At the autonomous level, a vague criterion is a system failure. This is why rubric quality matters now: sharper criteria today are the contract that enables safer delegation tomorrow.

For the full treatment — including what changes, what doesn't, and the practical implications — see [Agent Autonomy Spectrum](../docs/maturity-model.md).

---

## Worked Example

> For a full walkthrough showing the human–AI interaction pattern — including assumption surfacing, audit findings, fix cycles, and escalated decisions — see [Worked Example: Deployment Notifications](../docs/worked-example.md).

The condensed example below shows what AIDOS artifacts contain. The full walkthrough shows how they're built.

**Scenario:** A team needs to improve how warehouse staff track inventory across multiple locations.

### Problem

Warehouse staff can't get accurate stock counts without checking three separate systems, taking approximately 20 minutes per lookup. This affects 150+ warehouse operators making daily restocking decisions. Goal: reduce stock lookup time to under 30 seconds. Non-goal: redesigning the procurement workflow.

### Solution

Add a unified stock dashboard to the warehouse management interface. Pull live counts from the existing inventory sources, surface inline. Two options were considered: embedded dashboard (chosen) vs. separate inventory hub (rejected — adds navigation, doesn't solve the core lookup time problem).

### Tech Design

**Boundaries:** one stock-dashboard component owns reads from the existing inventory sources; it does not own write-paths. **State ownership:** for each item, the inventory source is the single source of truth; the dashboard caches a derivation with a stated freshness window. **Failure posture:** if a source is unavailable, stale data surfaces with a "data unavailable" indicator — the user is never blocked. **Invariant:** every displayed count is attributable to exactly one source.

### Testing

Behavioural assertions cover: counts displayed update within the stated freshness window; only authorised stock data surfaces; the "data unavailable" indicator appears when a source is unavailable; the dashboard renders across the supported device classes. Every assertion traces to a requirement in the Solution or a constraint in the Tech Design.

### Audit Finding (Example)

On Pass 1, the auditor flagged the Tech Design against the Problem:

| Criterion | Assessment | Evidence | Classification |
|---|---|---|---|
| A6: Failure and recovery posture | Partial | At shift changeover, 150+ operators hit the dashboard simultaneously. If the freshness window has just elapsed, every operator triggers a refresh against the inventory source — turning a stated quality property into a failure mode for the upstream source. The architectural posture for this contention isn't named. | Risk |

The builder addressed it by adding a pre-warm pattern: the dashboard's freshness refresh schedules ahead of each shift changeover, so the source-of-truth fetch happens once before the burst rather than 150 times concurrently. Pass 2 cleared.

### Escalated Decision (Example)

During the Problem stage, an issue was escalated:

> **I3: Inventory data ownership.** Three warehouse locations maintain separate inventory records with no single source of truth. Which system is authoritative?
>
> **Options:** (A) Use the most recently updated count from any location. (B) Designate one system as authoritative. (C) Surface all with location attribution.
>
> **Recommendation:** Option B — designate one authoritative source. Simplest implementation, clearest accountability.
>
> **Downstream impact:** If Option A or C, the Tech Design needs merge/conflict logic and the Testing scope expands significantly.

Stakeholder decided Option B. Issue moved to Decisions table.

---

## Principles

1. **Human directs, AI holds the pen.** AI creates and modifies. The human steers and decides.
2. **The artifact is the interface.** Everything goes in the document. If it's not captured, it doesn't exist.
3. **Just enough to get the thing done.** Good enough to build the next step from — move on. Don't polish.
4. **Rubrics define done.** Quality is assessed against explicit criteria with evidence, not vibes.
5. **The stack is structure, not sequence.** Work flows forward and backward. Earlier artifacts aren't frozen.
6. **Separate building from auditing.** The person who built it is not the person who checks it.
7. **Coherence across artifacts.** Each artifact is checked against its own rubric and the artifact before it.
8. **Capture decisions inline.** When a decision is made, it goes in the artifact immediately with rationale.
9. **Surface issues early.** Unknowns become explicit issues. Escalations get decision packets. Nothing hides.
10. **Challenge scope before committing.** Every item in scope must trace to a stated need. YAGNI.
11. **Show before you're ready.** A working prototype in front of a real stakeholder this week beats a polished solution in six weeks.
12. **The framework waits for humans.** AI makes action fast. Decisions still need people. The rhythm respects that.
13. **Rubrics evolve.** Retrospectives feed lessons back into the quality standards. The framework improves with use.
14. **Delivery artifacts are the long-term record.** Keep them current as the feature evolves.
15. **Solutions say WHAT, direction guides HOW.** The Solution never names the system's internal parts. Tech Design offers direction; devs follow it or push back. Silent compliance is the only wrong response.
