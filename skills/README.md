# AIDOS Skills

Claude Skills packaged from the AIDOS framework — ready-to-upload ZIPs for Claude.ai and Claude Code.

Four skills ship from this directory, all built from the framework source in [`../src/`](../src/) — edit the framework, rebuild, and the four skills update:

- **AIDOS Builder** — scaffold and iterate on delivery artifacts (Problem, Solution, Tech Design, Testing) at Epic / Feature / Story scale
- **AIDOS Auditor** — audit artifacts against AIDOS rubrics (Core, Problem, Solution, Tech Design, Testing, plus the Breakdown rubric for decomposition audits)
- **AIDOS Breakdown** — decompose an Epic or Feature into stub Features and Stories; conversational scaffolding for the BA persona
- **AIDOS Fanout** — coordinate sub-agents (in Claude Code) to fill out per-Story artifacts after a breakdown is committed; two-phase dispatch at Epic scope, single-phase at Feature scope

---

## Prerequisites

- A Claude account — Claude.ai, Claude Code, or Claude Desktop
- (Optional, for building from source) PowerShell 5.1+ or PowerShell Core
- (Optional, for the GitHub workflow path) the [GitHub MCP Connector](../src/connectors/github/README.md) configured in Claude Desktop

## Install

### Option A — Download prebuilt skills (recommended)

Download the latest prebuilt ZIPs from the Framework Explorer site:

- [`aidos-builder.zip`](https://shobman.github.io/aidos/skills/aidos-builder.zip)
- [`aidos-auditor.zip`](https://shobman.github.io/aidos/skills/aidos-auditor.zip)
- [`aidos-breakdown.zip`](https://shobman.github.io/aidos/skills/aidos-breakdown.zip)
- [`aidos-fanout.zip`](https://shobman.github.io/aidos/skills/aidos-fanout.zip)

**Install on Claude.ai:**

1. Go to **Settings → Customize → Skills**
2. Click **Upload** and select the ZIP
3. The skill appears in your skill list — Claude uses it when relevant

**Install in Claude Code:**

Extract the ZIP contents into your project:

```
.claude/skills/aidos-builder/     ← contents of aidos-builder.zip
.claude/skills/aidos-auditor/     ← contents of aidos-auditor.zip
.claude/skills/aidos-breakdown/   ← contents of aidos-breakdown.zip
.claude/skills/aidos-fanout/      ← contents of aidos-fanout.zip
```

### Option B — Build from source

If you've modified the framework locally, build your own ZIPs (see **Develop** below), then install them the same way.

## Use

Once installed, invoke the skills in a Claude session:

```
/aidos-builder     — scaffold and iterate on delivery artifacts
/aidos-auditor     — audit an artifact against the rubrics
/aidos-breakdown   — decompose an Epic or Feature into stub Features and Stories
/aidos-fanout      — fill out per-Story artifacts after a breakdown is committed (Claude Code)
```

**Builder session flow:** the skill asks what you're working on, infers scale (Epic / Feature / Story), scaffolds the right document structure, and iterates with you to build artifacts. It captures decisions, assumptions, issues, and overflow inline.

**Auditor session flow:** the skill runs a three-pass audit against Core and discipline rubrics, checks coherence with preceding artifacts, and classifies findings as Bug / Risk / Idea.

**Breakdown session flow:** conversational BA scaffolding — the skill asks about the Epic or Feature scope, walks you through decomposition, and writes stub Feature and Story files to `.aidos/`. See [`../src/`](../src/) for the framework detail.

**Fanout session flow (Claude Code only):** after a breakdown is committed, Fanout reads the stub artifacts and dispatches parallel sub-agents to build out Problem → Solution → Tech Design → Testing for each Story. Two-phase (Epic-scope breakdown then per-Story build) or single-phase (Feature scope). See [`../src/`](../src/) for configuration options.

**Environment awareness.** The skills operate in two modes:

- **With the GitHub MCP Connector configured** (Claude Desktop): the skills use MCP tools (`open_workspace`, `read_artifacts`, `save`, `edit`, `diff`, `publish`, `resolve`) to manage a working branch in a GitHub repo. See [`../src/connectors/github/README.md`](../src/connectors/github/README.md).
- **With direct filesystem access** (Claude Code, or any environment with file read/write): the skills read and write `.aidos/` files directly.

**Publish side-effects.** If the target repo has a `publish.*` section in its `.aidos/manifest.json` (e.g. `publish.confluence`), saving or merging to the target branch may trigger automatic publishing. The builder warns about this before you publish.

## Skills structure

```
skills/
├── builder/
│   └── SKILL.md             ← Claude skill descriptor for Builder (metadata + included files + rules)
├── auditor/
│   └── SKILL.md             ← Claude skill descriptor for Auditor
├── breakdown/
│   └── SKILL.md             ← Claude skill descriptor for Breakdown
├── fanout/
│   └── SKILL.md             ← Claude skill descriptor for Fanout
├── dist/                    ← Built ZIPs — gitignored, output of build.ps1
│   ├── aidos-builder.zip
│   ├── aidos-auditor.zip
│   ├── aidos-breakdown.zip
│   └── aidos-fanout.zip
├── build.ps1                ← Build script (PowerShell)
└── README.md                ← This file
```

The `SKILL.md` files in each subdirectory are the entry point Claude loads first. They describe the skill, list included files, and define the rules. The rest of the skill content (framework, rubrics, templates, prompts) is pulled from [`../src/`](../src/) at build time.

## Develop

### Build from source

Run the build script from anywhere on your machine — it resolves paths relative to itself:

```powershell
pwsh skills/build.ps1
```

or on Windows PowerShell:

```powershell
.\skills\build.ps1
```

Output:

```
skills/dist/aidos-builder.zip
skills/dist/aidos-auditor.zip
skills/dist/aidos-breakdown.zip
skills/dist/aidos-fanout.zip
```

The script:

1. Clones a temporary staging directory
2. Copies each skill's `SKILL.md` as the entry point
3. Pulls framework, rubrics, templates, and prompts from `../src/`
4. Rewrites relative path references in the prompts (`src/rubrics/` → `rubrics/` etc.) so paths work inside the packaged ZIP
5. Compresses to `skills/dist/*.zip`

Each skill has a specific file list — the builder gets templates, the auditor gets rubrics, breakdown gets decomposition prompts, fanout gets dispatch prompts. See `build.ps1` for the exact manifest.

### Edit skill behaviour

To change **what a skill does**, edit its `SKILL.md`:

- `skills/builder/SKILL.md` — builder entry point, rules, included files
- `skills/auditor/SKILL.md` — auditor entry point, included files
- `skills/breakdown/SKILL.md` — breakdown entry point, rules, included files
- `skills/fanout/SKILL.md` — fanout entry point, dispatch rules, included files

To change the **framework content** used by the skills (rubrics, templates, prompts, methodology), edit files in [`../src/`](../src/). The next build picks them up automatically.

### Test locally

Build the skill, then install it in Claude Code by extracting the ZIP into `.claude/skills/` in a test project. Run a full session (e.g. build a Problem artifact for a made-up feature) to verify behaviour.

For frequent iteration, point `.claude/skills/aidos-builder/` at the `temp` staging directory used by `build.ps1` — but remember to rebuild before committing.

### CI and publishing

The `.github/workflows/publish-skills.yml` workflow rebuilds the skills on every push to `main` and publishes the ZIPs to GitHub Pages at [`shobman.github.io/aidos/skills/`](https://shobman.github.io/aidos/skills/). You don't need to commit the `dist/` folder — it's gitignored. CI is the single source of published truth.
