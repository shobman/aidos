# AIDOS Confluence Connector

One-way publish of AIDOS artifacts from a `.aidos/` folder to Confluence.
The repository is source of truth. Confluence is a read-only projection.

## How It Works

The publish script reads a `manifest.json` from a `.aidos/` folder, converts
each listed markdown artifact to Confluence storage format (XHTML), and
creates or updates child pages under a root page you designate.

Pages are matched by **title** (derived from the filename). No Confluence
page IDs are stored in the manifest — the script looks up existing child
pages at runtime. This keeps the manifest stateless and idempotent: delete a
page in Confluence and re-sync, it recreates cleanly.

Each artifact page gets a **Page Properties** macro at the top with a Status
lozenge reflecting the artifact's status from the manifest. The root page
gets a **Page Properties Report** macro that aggregates all child statuses
into a dashboard table.

## Prerequisites

- **Confluence Cloud** (not Server/Data Center)
- A Confluence **API token** — generate one at
  https://id.atlassian.com/manage-profile/security/api-tokens
- A **root page** in your Confluence space — create one manually, then copy
  its page ID from the URL (the numeric ID in `…/pages/123456789/…`)

## Manifest

Place a `manifest.json` in your `.aidos/` folder:

```json
{
  "publish": {
    "target": "confluence",
    "confluenceBaseUrl": "https://example.atlassian.net",
    "spaceKey": "PROJ",
    "rootPageId": "123456789",
    "secrets": {
      "confluenceEmail": "CONFLUENCE_EMAIL",
      "confluenceToken": "CONFLUENCE_TOKEN"
    }
  },
  "artifacts": {
    "problem.md": { "status": "Draft" },
    "solution.md": { "status": "Not Started" },
    "tech-design.md": { "status": "Not Started" },
    "testing.md": { "status": "Not Started" },
    "issues-log.md": { "status": "In Progress" }
  }
}
```

| Field | Description |
|-------|-------------|
| `publish.target` | Must be `"confluence"` |
| `publish.confluenceBaseUrl` | Your Atlassian Cloud URL |
| `publish.spaceKey` | Confluence space key |
| `publish.rootPageId` | ID of the parent page for all artifacts |
| `publish.secrets` | Documents which GitHub secrets to create (not used at runtime) |
| `artifacts.<file>` | Filename relative to the `.aidos/` folder |
| `artifacts.<file>.status` | One of: `Not Started`, `Draft`, `In Progress`, `Review`, `Done`, `Blocked` |

Validate your manifest against `manifest.schema.json` in this directory.

## Status Colours

| Status | Confluence Lozenge Colour |
|--------|--------------------------|
| Not Started | Grey |
| Draft | Yellow |
| In Progress | Blue |
| Review | Purple |
| Done | Green |
| Blocked | Red |

## GitHub Actions Workflow

Add this workflow to your consuming repo:

```yaml
name: Publish AIDOS to Confluence
on:
  push:
    paths: ['.aidos/**']
  workflow_dispatch:

jobs:
  publish:
    uses: shobman/aidos/.github/workflows/confluence-publish.yml@main
    with:
      manifest-path: .aidos/manifest.json
    secrets:
      confluence_email: ${{ secrets.CONFLUENCE_EMAIL }}
      confluence_token: ${{ secrets.CONFLUENCE_TOKEN }}
```

Then add `CONFLUENCE_EMAIL` and `CONFLUENCE_TOKEN` as repository secrets.

If your repo has multiple `.aidos/` folders, omit `manifest-path` and the
workflow will auto-discover all `manifest.json` files.

## Local Testing

Run the script locally with `--dry-run` to see what would be published
without calling the Confluence API:

```bash
node src/connectors/confluence/publish.js .aidos/manifest.json --dry-run
```

This converts each markdown file, assembles the Confluence storage format
body, and prints it to stdout. No authentication is required for dry-run.

## Title Matching

Page titles are derived from artifact filenames:

| Filename | Confluence Page Title |
|----------|----------------------|
| `problem.md` | Problem |
| `tech-design.md` | Tech Design |
| `issues-log.md` | Issues Log |

If you rename a file, the next publish creates a new page with the new title.
The old page remains in Confluence and can be deleted manually.
