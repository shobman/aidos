# AIDOS Skills

Claude Skills packaged from the AIDOS framework — ready-to-upload ZIPs for Claude.ai and Claude Code.

Two skills ship from this directory, both built from the framework source in [`../src/`](../src/) — edit the framework, rebuild, and both skills update:

- **AIDOS Builder** — scaffold and iterate on delivery artifacts (Problem, Solution, Tech Design, Testing) at Epic / Feature / Story scale
- **AIDOS Auditor** — audit artifacts against AIDOS rubrics (Core, Problem, Solution, Tech Design, Testing), then run the Readership pass

---

## Prerequisites

- A Claude account — Claude.ai, Claude Code, or Claude Desktop
- (Optional, for building from source) PowerShell 5.1+ or PowerShell Core

## Install

### Option A — Download prebuilt skills (recommended)

Download the latest prebuilt ZIPs from the Framework Explorer site:

- [`aidos-builder.zip`](https://shobman.github.io/aidos/skills/aidos-builder.zip)
- [`aidos-auditor.zip`](https://shobman.github.io/aidos/skills/aidos-auditor.zip)

**Install on Claude.ai:**

1. Go to **Settings → Customize → Skills**
2. Click **Upload** and select the ZIP
3. The skill appears in your skill list — Claude uses it when relevant

**Install in Claude Code:**

Extract the ZIP contents into your project:

```
.claude/skills/aidos-builder/     ← contents of aidos-builder.zip
.claude/skills/aidos-auditor/     ← contents of aidos-auditor.zip
```

### Option B — Build from source

If you've modified the framework locally, build your own ZIPs (see **Develop** below), then install them the same way.

## Use

Once installed, invoke the skills in a Claude session:

```
/aidos-builder     — scaffold and iterate on delivery artifacts
/aidos-auditor     — audit an artifact against the rubrics
```

**Builder session flow:** the skill asks what you're working on, infers scale (Epic / Feature / Story), scaffolds the right document structure, and iterates with you to build artifacts. It captures decisions, assumptions, and issues inline.

**Auditor session flow:** the skill runs a three-pass audit against Core and discipline rubrics, checks coherence with preceding artifacts, and classifies findings as Bug / Risk / Idea. It then runs the Readership pass — a separate, cheap check with its own verdict, never conflated with the rubric one.

**Environment awareness.** The skills detect whether they have filesystem access. With it (Claude Code, or any environment with file read/write) they read and write artifact files directly; without it they work with the artifacts in the conversation.

## Skills structure

```
skills/
├── builder/
│   └── SKILL.md             ← Claude skill descriptor for Builder (metadata + included files + rules)
├── auditor/
│   └── SKILL.md             ← Claude skill descriptor for Auditor
├── dist/                    ← Built ZIPs — gitignored, output of build.ps1
│   ├── aidos-builder.zip
│   └── aidos-auditor.zip
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
```

The script:

1. Clones a temporary staging directory
2. Copies each skill's `SKILL.md` as the entry point
3. Pulls framework, rubrics, templates, and prompts from `../src/`
4. Rewrites relative path references in the prompts (`src/rubrics/` → `rubrics/` etc.) so paths work inside the packaged ZIP
5. Compresses to `skills/dist/*.zip`

Each skill has a specific file list — the builder gets the templates, the auditor gets the rubrics. See `build.ps1` for the exact manifest.

### Edit skill behaviour

To change **what a skill does**, edit its `SKILL.md`:

- `skills/builder/SKILL.md` — builder entry point, rules, included files
- `skills/auditor/SKILL.md` — auditor entry point, included files

To change the **framework content** used by the skills (rubrics, templates, prompts, methodology), edit files in [`../src/`](../src/). The next build picks them up automatically.

### Test locally

Build the skill, then install it in Claude Code by extracting the ZIP into `.claude/skills/` in a test project. Run a full session (e.g. build a Problem artifact for a made-up feature) to verify behaviour.

For frequent iteration, point `.claude/skills/aidos-builder/` at the `temp` staging directory used by `build.ps1` — but remember to rebuild before committing.

### CI and publishing

The `.github/workflows/publish-skills.yml` workflow rebuilds the skills on every push to `main` and publishes the ZIPs to GitHub Pages at [`shobman.github.io/aidos/skills/`](https://shobman.github.io/aidos/skills/). You don't need to commit the `dist/` folder — it's gitignored. CI is the single source of published truth.
