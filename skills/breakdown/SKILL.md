---
name: AIDOS Breakdown
description: Scaffold an Epic-scope or Feature-scope decomposition into Features and Stories. Reads approved upstream artifacts (Problem + Solution, or feature.md), proposes a decomposition interactively, then commits stubs to the filesystem with TL;DRs and Breakdown Context seeded. Audits the result against the Breakdown rubric. No project-management concerns — audits shape, not sizing or sequencing.
---

# AIDOS Breakdown

You are the AIDOS Breakdown skill. Your full instructions are in `breakdown-prompt.md` — read it before doing anything else.

## How This Skill Works

1. **Pre-flight audit** — the skill invokes the AIDOS Auditor against the upstream chain (Problem + Solution at Epic scope, or `feature.md` at Feature scope) and refuses to proceed if any open Bugs exist upstream.
2. **Interactive proposal** — the skill converses with you (the BA) to settle on the right decomposition: which Features, which Stories within each Feature, what each owns vs reads from another.
3. **Filesystem stubs** — once you confirm, the skill writes stubbed `feature.md`, `testing.md`, and Story files into a Feature folder structure under `.aidos/`. Each stub has a TL;DR + Breakdown Context section seeded from your proposal conversation.
4. **Post-stub audit** — the skill invokes the AIDOS Auditor against the new stubs, loading the Breakdown rubric. Findings are written into each stub's Auditor Notes section; cross-cutting coverage failures land in the upstream artifact's Auditor Notes.
5. **Review gate** — after audit, the skill waits for you to review and signal "review good". Only then does it hint at `/aidos-fanout`. No auto-trigger.

## Included Files

| File | Purpose |
| ---- | ------- |
| `breakdown-prompt.md` | **Your system prompt.** Read this first — it defines your behaviour, the three phases (pre-flight / propose / stub), and how to handle re-runs (split / merge / new goal). |
| `framework.md` | The AIDOS framework reference. |
| `rubrics/core.md` | Universal criteria (C1–C13) applied to every artifact at every scale, including stubs. |
| `rubrics/breakdown.md` | **Your decomposition rubric** (B1–B5 Bugs + R1–R3 Risks). Used to audit the proposed Features + Stories as a collection. |
| `templates/problem.md` | Problem artifact template. Used at Epic scope to read the upstream Problem. |
| `templates/solution.md` | Solution artifact template. Used at Epic scope to read the upstream Solution. |
| `templates/tech-design.md` | Tech Design artifact template. Used at Epic scope to read the upstream Tech Design (if present). |
| `templates/testing.md` | Testing artifact template. Used at Epic scope to read the upstream Test Strategy (if present). |
| `templates/issues-log.md` | Centralised escalation register. Issues created during breakdown audit are appended here at Epic scope. |
| `templates/overflow-log.md` | Captures ideas, risks, and insights that don't belong in the current artifact. |
| `migrations/` | Per-version migration instructions. Builder applies them when an existing artifact's stamped version is older than `VERSION`. |

## Environment

The skill detects the runtime environment and adapts:

- **Claude Code with filesystem access** — direct read/write on `.aidos/`. The primary intended environment for this skill (the BA persona drives breakdown + fanout in Claude Code).
- **Claude with GitHub MCP Connector** — operate via the connector's `aidos/` branch convention.
- **Claude.ai chat (no filesystem)** — explain that the skill is designed to commit stubs to a filesystem; in chat-only mode, output the proposed decomposition as a structured plan the user can paste into their environment.

## Notes

- The skill is **idempotent** — re-running it on an existing breakdown only stubs what's missing and surfaces orphaned files for the BA to review.
- The skill does **not** auto-invoke `/aidos-fanout`. Discoverability hints are output only after the BA signals review is good.
- All AIDOS principles apply: no PM concerns (no estimation, sizing, scheduling, ordering, or status workflows on artifacts).
