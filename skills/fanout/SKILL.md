---
name: aidos-fanout
description: Orchestrate sub-agents to fill out per-Feature and per-Story artifacts in an .aidos/ folder whose breakdown has been committed and audited clean. Two-phase dispatch at Epic scope (Features first, then Stories); single-phase at Feature scope (Stories only). Context-isolated, bounded parallelism, autonomous per-artifact build–audit–fix loops.
---

# AIDOS Fanout

You are the AIDOS Fanout skill. Your full instructions are in `fanout-prompt.md` — read it before doing anything else.

## How This Skill Works

1. **Pre-flight check** — the skill verifies that breakdown stubs exist and the breakdown audit passed (no open Bugs in any stub's Auditor Notes). Refuses to dispatch if either check fails.
2. **Phase 1 (Epic scope only)** — one sub-agent per Feature folder builds `feature.md` + `testing.md`. Bounded parallelism (default 3 concurrent). Each sub-agent runs the autonomous Builder → Auditor → fix loop, capped at AIDOS's three-pass limit. Sub-agents are context-isolated: they cannot read other Feature folders.
3. **Phase 2 (Epic and Feature scope)** — one sub-agent per Story file builds the Story artifact (P+S+TD+AC combined). Each sub-agent reads only the Epic chain plus its parent Feature's artifacts. Upstream Issues from Phase 1 are propagated as Risks into Story stubs before dispatch.
4. **Final report** — the skill collects results and produces a structured summary: Features built / blocked, Stories built / blocked, open Issues across all artifacts, per-blocked-item reasons. Does NOT auto-loop on blocked items — the BA investigates and re-invokes targeted Builder runs.

## Included Files

| File | Purpose |
| ---- | ------- |
| `fanout-prompt.md` | **Your system prompt.** Read this first — it defines your behaviour, the two phases, context isolation, bounded parallelism, propagation rules, and blocked-event semantics. |
| `framework.md` | The AIDOS framework reference. |

## Environment

The skill is designed for **Claude Code** where the Agent tool provides sub-agent dispatch primitives. In other environments (Claude.ai chat, Claude Desktop), the skill explains that fan-out requires sub-agent capabilities and recommends running the equivalent steps manually (BA invokes Builder per Feature, then per Story, in order).

## Notes

- The skill does not write artifact content directly — it orchestrates sub-agents that invoke the existing AIDOS Builder.
- All builder/auditor separation principles hold: the sub-agent's internal loop is Builder → Auditor → Builder → …, with the Auditor running as a distinct invocation each pass.
- Concurrency is a system resource cap (avoiding throttling, controlling cost), not scheduling.
- Phase ordering reflects architectural data flow (Story sub-agents read what Feature sub-agents wrote), not human-time-management.
