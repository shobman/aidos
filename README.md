# AIDOS — AI Delivery Operating System

*In ancient Greece, Aidos was the spirit of restraint — the inner voice that held you back from hubris. AI gave us the power to build anything. Aidos is the discipline to ask whether we should.*

---

AI collapsed the cost of getting to a first pass. A spec that took a sprint can be drafted in an afternoon. A feature that took a team can be prototyped by one person with an agent. The mechanical cost of software has dropped dramatically.

But the thinking hasn't got cheaper. Humans still need to understand problems, align with each other, and make judgment calls. That part is as slow and expensive as it ever was — and when building is fast, bad assumptions compound faster too.

**AIDOS helps teams think clearly, document decisions, and audit delivery quality — before implementation speed compounds mistakes.**

> 📖 Read [The Hard Part Isn't the Code](docs/manifesto.md) for the full philosophy behind this project.

---

## What This Actually Is

Four delivery artifacts that build on each other:

**Problem** → **Solution** → **Tech Design** → **Testing**

| Artifact | Question It Answers |
|---|---|
| **Problem** | What is happening, for whom, why it matters, and what success looks like |
| **Solution** | How the proposed response works as a system, including options and trade-offs |
| **Tech Design** | How the response is shaped architecturally — boundaries, state ownership, contracts at seams, invariants, failure posture |
| **Testing** | How we verify it works and trace results back to requirements |

These are delivery artifacts — living documents that stay current as the feature evolves. They are the long-term record of the thinking, corrected in place as the work teaches. They are not a complete account of the code; once it is written, the code is the law.

Each artifact is checked against its own quality rubric **and** against the artifact before it. The Solution has to actually solve the Problem. The Tech Design has to actually implement the Solution. The Testing has to actually verify the Tech Design against the Solution's goals. If the chain breaks, you find out in a review — not in production.

**Rubrics with teeth.** Not "is this good?" — but "can someone unfamiliar with this project understand the problem without prior conversation?" Pass, Partial, or Fail. With cited evidence. The artifact doesn't advance until bugs are fixed.

**Builder/auditor separation.** AIDOS depends on separation between artifact creation and artifact audit. One person sprints ahead with AI to create the artifact. A different person checks it against the rubrics and the preceding artifact. The same person can't be both builder and final judge. That's the governance.

> Browse the framework interactively at [shobman.github.io/aidos](https://shobman.github.io/aidos/) — the Framework Explorer renders the full rubrics and templates as a navigable site.

---

## How It Changes the Way You Work

AIDOS uses pulse-based delivery: short bursts of AI-assisted artifact creation, separated by explicit human review checkpoints.

1. **Sprint** — build an artifact with AI in an afternoon that would've taken a sprint.
2. **Park** — put the artifact down with its status updated, move on.
3. **Align** — bring humans in. They review, react, decide.
4. **Feed back** — process their decisions with AI in minutes, not days.
5. **Sprint again** — or switch to another project while this one waits for the next human checkpoint.

The artifacts hold the state so you can context-switch between projects without losing anything. When Project A is parked waiting for stakeholder review, you sprint on Project B.

---

## Example

A team needs to improve how warehouse staff track inventory across multiple locations:

| Artifact | What Gets Captured |
|---|---|
| **Problem** | Warehouse staff can't get accurate stock counts without checking three separate systems, taking ~20 min per lookup. Affects 150+ operators making daily restocking decisions. |
| **Solution** | Add a unified stock dashboard to the warehouse management interface. Staff see current counts — accurate within a stated freshness window — inline in the interface they already use. |
| **Tech Design** | Architectural shape: one boundary owns stock-count reads with a stated freshness window. State ownership: the existing inventory source is the single source of truth per item; the dashboard caches a derivation. Failure posture: stale data surfaces with a "data unavailable" indicator rather than blocking the page. |
| **Testing** | Validate data freshness, permissions, rendering across devices, fallback states. Every test traces to a requirement in the Solution. |

The Problem artifact gets audited: is the stakeholder impact clear? Are the goals measurable? Is the scope bounded? Then the Solution gets audited against the Problem: does it actually address the stated goals? Then the Tech Design against the Solution. The chain holds or it breaks at an identifiable point.

---

## Components

AIDOS is two independent pieces. Pick the ones you need — each has its own README with the same structure: Prerequisites → Install → Use → Develop.

| Component | What it is | README |
|---|---|---|
| **Framework** | The operating model, rubrics, templates, and prompts. Pure markdown, no build. Usable as-is with any AI that accepts a system prompt. | [`src/README.md`](src/README.md) |
| **Skills** | The framework packaged as two Claude Skills: Builder and Auditor. Published as ZIPs, installable in Claude.ai and Claude Code. | [`skills/README.md`](skills/README.md) |

Use either, or both.

---

## Quick Start

Pick the path that matches how you want to try AIDOS.

**I just want to try it in an AI chat, no install**
Copy [`src/prompts/builder-prompt.md`](src/prompts/builder-prompt.md) into a Claude / ChatGPT / Gemini session and describe what you're delivering. That's it. Audit in a different session with [`src/prompts/auditor-prompt.md`](src/prompts/auditor-prompt.md).

**I use Claude and want a proper skill**
Download both ZIPs — [`aidos-builder.zip`](https://shobman.github.io/aidos/skills/aidos-builder.zip) and [`aidos-auditor.zip`](https://shobman.github.io/aidos/skills/aidos-auditor.zip) — upload to Claude.ai (Settings → Customize → Skills) or extract into `.claude/skills/` in a Claude Code project. Then use `/aidos-builder` and `/aidos-auditor`. See [`skills/README.md`](skills/README.md).

For Claude-specific tips and the relationship between pieces, see [CLAUDE.md](CLAUDE.md).

---

## What's in the Repo

```
README.md                         ← You are here
CONTRIBUTING.md                   ← How to propose rubric changes
docs/
└── manifesto.md                  ← The philosophy — why decision quality matters
src/
├── framework.md                  ← The full operating model — start here
├── rubrics/
│   ├── core.md                   ← Universal criteria (C1–C16) for every artifact
│   ├── problem.md                ← Problem criteria (P1–P13) — Product lens
│   ├── solution.md               ← Solution criteria (S1–S10) — Analysis lens
│   ├── tech-design.md            ← Tech Design criteria (A1–A11) — Architecture lens
│   ├── testing.md                ← Testing criteria (T1–T10) — Quality lens
│   └── readership.md             ← Readership criteria (R1–R4) — the second audit pass
├── templates/
│   ├── problem.md                ← Problem artifact template
│   ├── solution.md               ← Solution artifact template
│   ├── tech-design.md            ← Tech Design artifact template
│   └── testing.md                ← Testing artifact template
├── migrations/                   ← Version-to-version artifact migration instructions
└── prompts/
    ├── builder-prompt.md         ← Self-contained AI builder session prompt
    └── auditor-prompt.md         ← Self-contained AI auditor session prompt
skills/
├── builder/SKILL.md              ← AIDOS Builder skill for Claude
├── auditor/SKILL.md              ← AIDOS Auditor skill for Claude
└── build.ps1                     ← Assembles and ZIPs skills for distribution
site/                             ← Framework Explorer (GitHub Pages)
```

---

## The Rubrics Evolve

Every project that gets burned by something the rubrics didn't catch can make them better.

Six weeks in, nobody owns it? That's a rubric criterion now. Forgot to check if a vendor already solves this? Rubric criterion. Assumed the regulatory requirement was met without verifying? Rubric criterion.

Not just a framework. A continuously hardened review system, built from real delivery failures.

The most valuable contribution to this repo isn't code. It's: *"We got burned by X. Here's the criterion that would have caught it."*

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

[MIT](LICENSE)
