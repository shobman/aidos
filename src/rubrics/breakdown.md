# Breakdown Rubric

The Breakdown Rubric audits a proposed decomposition of an Epic (or single Feature) into Features and Stories. It is applied by the AIDOS Auditor against the collection of stubbed files produced by the `aidos-breakdown` skill, before any sub-agent fan-out work begins.

The Breakdown Rubric audits **shape**, not project-management properties. There is no sizing field, no rollout column, no scheduling, no status workflow — those belong to the team's PM system, not to AIDOS.

## Criteria

| #   | Criterion                                  | What "Pass" Looks Like                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | Independence                               | Every Story can be delivered as its own slice. Listed dependencies are **architectural** (one Story reads another's contract) — never **scheduling** (do A then B). If a scheduling dependency would need to be declared, the Stories aren't independent — split or merge them.                                                                                                                                                                                                  |
| B2  | One-dev-one-sprint shape                   | From the TL;DR and implied scope, the Story plausibly fits one dev's work for one sprint. Auditor judges shape, not numeric estimates. Story fails B2 if any of the following hold without explicit justification in the stub's Breakdown Context: spans more than one of {frontend, backend, infrastructure, data, ML/model} in a single deliverable; introduces more than one new component / service / module / schema; uses open-ended verbs (understand, explore, investigate, research, recommend) without a concrete deliverable; TL;DR reads as a Feature rather than a Story; implies multiple separate integration points with external systems. |
| B3  | Coverage (downstream coherence)            | The Features + Stories collectively address all functional areas of the upstream Solution (Epic scope) or Feature (Feature scope). No upstream scope dropped; no Story introduces scope outside the upstream.                                                                                                                                                                                                                                                                       |
| B4  | Boundary clarity                           | From the Story TL;DRs alone, an auditor can see what each Story owns vs reads from another. No two Stories overlap on ownership. No Story is so vague that ownership is unclear. Audited from the TL;DR — not declared as a field.                                                                                                                                                                                                                                                |
| B5  | Feature scope                              | Each Feature has a TL;DR distinct from sibling Features. Features don't overlap. Each Feature's scope is clearly bounded and doesn't accidentally collect unrelated work.                                                                                                                                                                                                                                                                                          |
| B6  | Title altitude at birth                    | Feature and Story stub titles read as problem statements at the same altitude as Core C14 — user-experience or business-outcome statements, not component, module, service, or technical-role names. The title is the first thing that bakes an implementation shape into the decomposition, and stub-creation is the cheapest moment to fix it. "Stale stock counts surface with a warning" passes; "Inventory source cache", "Resolver Service" fail. Vague names ("Backend changes", "Stuff for the dashboard") also fail. |
| R1  | Feature coherence                          | Stories within a Feature share a coherent purpose. Stories aren't a flat dump under an arbitrary Feature — there is a reason they belong together (shared module, shared user journey, shared boundary).                                                                                                                                                                                                                                                                          |
| R2  | Architectural dependencies declared        | Any architectural dependency between Stories is captured either in the relevant `feature.md`'s Tech Design portion (after Fanout Phase 1) or in the dependent Story's Breakdown Context section (before Phase 1). Implicit dependencies fail.                                                                                                                                                                                                                      |

**B1–B6 are Bugs** (must fix before proceeding). **R1–R2 are Risks** (surface; may be promoted to Issues for human review). Note: title quality was a Risk (the old R1, "Naming clarity") until v2.0.0 — it is now Bug-tier B6, because component-named stubs are the entry point for the implementation lock-in the altitude discipline exists to prevent.

## Assessment

The Auditor scores every applicable criterion as **Pass**, **Partial**, or **Fail** with cited evidence drawn from the stubbed files (specifically each stub's TL;DR + Breakdown Context section).

- **Pass** — the criterion is satisfied across all stubs in the collection.
- **Partial** — the criterion is satisfied for most stubs but not all; the failing stubs are named.
- **Fail** — the criterion is not satisfied for one or more stubs.

A finding's severity follows its criterion — B-prefixed criteria produce Bugs, R-prefixed criteria produce Risks. Findings are written into the affected stub's Auditor Notes section. Cross-cutting failures of B3 (coverage) are written to the upstream artifact's Auditor Notes section (Epic Solution at Epic scope; parent `feature.md` at Feature scope) — because that's where the coverage chain actually broke.

## When to Use

The Breakdown Rubric is applied after the `aidos-breakdown` skill commits stubs to the filesystem, before the `aidos-fanout` skill dispatches any sub-agents. It is loaded in addition to the existing Core Rubric — the Breakdown Rubric audits the decomposition shape; the Core Rubric audits each stub's TL;DR + Breakdown Context for clarity, scope, and grounding.

Applied at:
- **Epic scope** — collection of `f{n}-{name}/feature.md` files plus their child `f{n}s{m}-{storyname}.md` files
- **Feature scope** — collection of `f{n}s{m}-{storyname}.md` files within a single Feature folder

Not applied at:
- **Story scope** — a single Story has no decomposition; the existing Story-level rubrics apply directly

## Coherence Check

The Breakdown is audited against the **Solution artifact** that precedes it at Epic scope, or against the **Feature artifact** (`feature.md`) that precedes it at Feature scope. This mirrors the existing pattern in `src/rubrics/tech-design.md` where Tech Design is audited against the Solution.

The coherence check (B3 — Coverage) asks: does the proposed decomposition fully address the upstream artifact's functional areas, without introducing scope outside the upstream? If the breakdown leaves Solution scope unaddressed, that gap is a Bug recorded in the Solution's Auditor Notes (not in any individual stub) — because the coverage chain broke at the Solution-to-Breakdown seam, not within any one Story.
