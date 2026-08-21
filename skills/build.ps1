# AIDOS Skills Build Script
# Creates ZIP files for Claude.ai skill upload
# Output: skills/dist/aidos-builder.zip, skills/dist/aidos-auditor.zip
#
# -Verify checks an existing skills/dist without rebuilding it, and exits
# non-zero if it is stale. skills/dist is gitignored, so it is per-checkout:
# a build run in one worktree leaves every other checkout untouched, and a
# stale ZIP is indistinguishable from a fresh one by looking at it. Run
# `build.ps1 -Verify` before installing from dist, and in CI.

param([switch]$Verify)

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$dist = Join-Path $PSScriptRoot "dist"
$temp = Join-Path ([System.IO.Path]::GetTempPath()) "aidos-skills-$(Get-Random)"

Add-Type -AssemblyName System.IO.Compression.FileSystem

# Skills that should exist, derived from the source tree rather than hardcoded,
# so a retired skill cannot linger in dist unnoticed.
function Get-ExpectedSkills {
    Get-ChildItem (Join-Path $PSScriptRoot '*') -Directory |
        Where-Object { Test-Path (Join-Path $_.FullName 'SKILL.md') } |
        ForEach-Object {
            $name = (Select-String -Path (Join-Path $_.FullName 'SKILL.md') -Pattern '^name:\s*(\S+)' |
                     Select-Object -First 1).Matches.Groups[1].Value
            [pscustomobject]@{ Dir = $_.FullName; Name = $name }
        }
}

function Invoke-Verify {
    $problems = @()
    $version = (Get-Content (Join-Path $root 'VERSION') -Raw).Trim()
    $expected = Get-ExpectedSkills

    if (-not (Test-Path $dist)) {
        Write-Host "STALE: skills/dist does not exist in this checkout. Run build.ps1." -ForegroundColor Red
        exit 1
    }

    # Newest source file anywhere the bundles draw from.
    $sources = @(
        Get-ChildItem (Join-Path $root 'src') -Recurse -File -ErrorAction SilentlyContinue
        Get-ChildItem (Join-Path $PSScriptRoot '*') -Recurse -File -Filter 'SKILL.md' -ErrorAction SilentlyContinue
        Get-Item (Join-Path $root 'VERSION')
        Get-Item (Join-Path $root 'CONTRIBUTING.md')
    ) | Where-Object { $_ }
    $newestSource = ($sources | Sort-Object LastWriteTimeUtc -Descending | Select-Object -First 1)

    foreach ($skill in $expected) {
        $zipPath = Join-Path $dist "$($skill.Name).zip"
        if (-not (Test-Path $zipPath)) { $problems += "missing: $($skill.Name).zip"; continue }

        $zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
        try {
            $entry = $zip.GetEntry("$($skill.Name)/VERSION")
            if (-not $entry) {
                $problems += "$($skill.Name).zip carries no VERSION"
            }
            else {
                $reader = New-Object System.IO.StreamReader($entry.Open())
                $stamped = $reader.ReadToEnd().Trim()
                $reader.Dispose()
                if ($stamped -ne $version) {
                    $problems += "$($skill.Name).zip is stamped $stamped but VERSION says $version"
                }
            }
        }
        finally { $zip.Dispose() }

        if ($newestSource -and (Get-Item $zipPath).LastWriteTimeUtc -lt $newestSource.LastWriteTimeUtc) {
            $rel = $newestSource.FullName.Substring($root.Length + 1)
            $problems += "$($skill.Name).zip is older than $rel"
        }
    }

    # A ZIP with no matching source directory is a retired skill still shipping.
    $names = $expected.Name
    Get-ChildItem $dist -Filter '*.zip' -ErrorAction SilentlyContinue | ForEach-Object {
        $n = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
        if ($names -notcontains $n) { $problems += "orphan: $($_.Name) has no skill directory - retired skill still in dist" }
    }

    if ($problems.Count) {
        Write-Host "`nskills/dist is STALE:" -ForegroundColor Red
        $problems | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
        Write-Host "`nRun build.ps1 (without -Verify) before installing from dist." -ForegroundColor Yellow
        exit 1
    }

    Write-Host "skills/dist is current: $($expected.Count) skill(s) at $version" -ForegroundColor Green
    exit 0
}

if ($Verify) { Invoke-Verify }

function Copy-To {
    param([string]$Src, [string]$Dest)
    $dir = Split-Path $Dest -Parent
    if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
    Copy-Item $Src $Dest
}

function Fix-PromptPaths {
    param([string]$File)
    $content = Get-Content $File -Raw
    $content = $content -replace '`src/rubrics/', '`rubrics/'
    $content = $content -replace '`src/templates/', '`templates/'
    $content = $content -replace '`src/migrations/', '`migrations/'
    $content = $content -replace '`src/framework\.md`', '`framework.md`'
    Set-Content $File $content -NoNewline
}

function New-SkillZip {
    param([string]$Name, [string]$StagingDir, [string]$OutPath)
    $zip = [System.IO.Compression.ZipFile]::Open($OutPath, 'Create')
    try {
        Get-ChildItem $StagingDir -File -Recurse | ForEach-Object {
            $rel = $_.FullName.Substring($StagingDir.Length + 1).Replace('\', '/')
            $entryName = "$Name/$rel"
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                $zip, $_.FullName, $entryName, [System.IO.Compression.CompressionLevel]::Optimal
            ) | Out-Null
        }
    }
    finally {
        $zip.Dispose()
    }
}

# Clean dist
if (Test-Path $dist) { Remove-Item $dist -Recurse -Force }
New-Item -ItemType Directory -Path $dist | Out-Null
New-Item -ItemType Directory -Path $temp | Out-Null

try {
    # --- Builder ---
    $b = Join-Path $temp "aidos-builder"

    Copy-To (Join-Path $PSScriptRoot "builder\SKILL.md")              (Join-Path $b "SKILL.md")
    Copy-To (Join-Path $root "src\prompts\builder-prompt.md")         (Join-Path $b "builder-prompt.md")
    Copy-To (Join-Path $root "src\framework.md")                     (Join-Path $b "framework.md")
    Copy-To (Join-Path $root "src\rubrics\core.md")                  (Join-Path $b "rubrics\core.md")
    Copy-To (Join-Path $root "src\templates\problem.md")             (Join-Path $b "templates\problem.md")
    Copy-To (Join-Path $root "src\templates\solution.md")            (Join-Path $b "templates\solution.md")
    Copy-To (Join-Path $root "src\templates\tech-design.md")         (Join-Path $b "templates\tech-design.md")
    Copy-To (Join-Path $root "src\templates\testing.md")             (Join-Path $b "templates\testing.md")
    Copy-To (Join-Path $root "CONTRIBUTING.md")                      (Join-Path $b "CONTRIBUTING.md")

    Copy-To (Join-Path $root "VERSION")                              (Join-Path $b "VERSION")

    $migSrc = Join-Path $root "src\migrations"
    if (Test-Path $migSrc) {
        Get-ChildItem $migSrc -File | ForEach-Object {
            Copy-To $_.FullName (Join-Path $b "migrations\$($_.Name)")
        }
    }

    Fix-PromptPaths (Join-Path $b "builder-prompt.md")

    New-SkillZip -Name "aidos-builder" -StagingDir $b -OutPath (Join-Path $dist "aidos-builder.zip")

    # --- Auditor ---
    $a = Join-Path $temp "aidos-auditor"

    Copy-To (Join-Path $PSScriptRoot "auditor\SKILL.md")             (Join-Path $a "SKILL.md")
    Copy-To (Join-Path $root "src\prompts\auditor-prompt.md")        (Join-Path $a "auditor-prompt.md")
    Copy-To (Join-Path $root "src\framework.md")                    (Join-Path $a "framework.md")
    Copy-To (Join-Path $root "src\rubrics\core.md")                 (Join-Path $a "rubrics\core.md")
    Copy-To (Join-Path $root "src\rubrics\problem.md")              (Join-Path $a "rubrics\problem.md")
    Copy-To (Join-Path $root "src\rubrics\solution.md")             (Join-Path $a "rubrics\solution.md")
    Copy-To (Join-Path $root "src\rubrics\tech-design.md")          (Join-Path $a "rubrics\tech-design.md")
    Copy-To (Join-Path $root "src\rubrics\testing.md")              (Join-Path $a "rubrics\testing.md")
    Copy-To (Join-Path $root "src\rubrics\readership.md")           (Join-Path $a "rubrics\readership.md")
    Copy-To (Join-Path $root "CONTRIBUTING.md")                     (Join-Path $a "CONTRIBUTING.md")

    Copy-To (Join-Path $root "VERSION")                             (Join-Path $a "VERSION")

    Fix-PromptPaths (Join-Path $a "auditor-prompt.md")

    New-SkillZip -Name "aidos-auditor" -StagingDir $a -OutPath (Join-Path $dist "aidos-auditor.zip")

    # Report
    Write-Host "`nBuild complete:" -ForegroundColor Green
    Get-ChildItem $dist -Filter "*.zip" | ForEach-Object {
        $size = [math]::Round($_.Length / 1KB, 1)
        Write-Host "  $($_.Name) - ${size} KB" -ForegroundColor Cyan
    }
}
finally {
    Remove-Item $temp -Recurse -Force -ErrorAction SilentlyContinue
}
