[CmdletBinding()]
param(
  [string[]]$Agent = @('agents'),
  [string[]]$Skill = @('all'),
  [switch]$Global,
  [switch]$Force,
  [switch]$DryRun,
  [string]$Ref = 'main',
  [string]$Repo = 'ThanhNguyxn07/Pixelcraft',
  [string]$Archive
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$canonicalAgents = @('claude', 'codex', 'agents', 'devin', 'cursor', 'gemini', 'copilot', 'windsurf', 'opencode')
$validAgents = $canonicalAgents + @('all')

function ConvertTo-CanonicalAgent([string]$Name) {
  $value = $Name.Trim().ToLowerInvariant()
  switch ($value) {
    'claude-code' { return 'claude' }
    'gemini-cli' { return 'gemini' }
    'github-copilot' { return 'copilot' }
    'open-code' { return 'opencode' }
    default { return $value }
  }
}

function Test-AnyPath([string]$Path) {
  $item = Get-Item -LiteralPath $Path -Force -ErrorAction SilentlyContinue
  return ($null -ne $item)
}

function Test-ReparsePoint([string]$Path) {
  $item = Get-Item -LiteralPath $Path -Force -ErrorAction SilentlyContinue
  return ($null -ne $item -and [bool]($item.Attributes -band [System.IO.FileAttributes]::ReparsePoint))
}

function Get-TargetRoot([string]$Name, [bool]$GlobalScope) {
  $homeDir = [System.Environment]::GetFolderPath('UserProfile')
  if ($GlobalScope) {
    if ($Name -eq 'claude') { return (Join-Path $homeDir '.claude/skills') }
    if ($Name -in @('codex', 'agents', 'devin')) { return (Join-Path $homeDir '.agents/skills') }
    if ($Name -eq 'cursor') { return (Join-Path $homeDir '.cursor/skills') }
    if ($Name -eq 'gemini') { return (Join-Path $homeDir '.gemini/skills') }
    if ($Name -eq 'copilot') { return (Join-Path $homeDir '.copilot/skills') }
    if ($Name -eq 'windsurf') { return (Join-Path $homeDir '.codeium/windsurf/skills') }
    if ($Name -eq 'opencode') { return (Join-Path $homeDir '.config/opencode/skills') }
  } else {
    $base = (Get-Location).Path
    if ($Name -eq 'claude') { return (Join-Path $base '.claude/skills') }
    if ($Name -in @('codex', 'agents', 'devin', 'cursor', 'gemini', 'copilot')) { return (Join-Path $base '.agents/skills') }
    if ($Name -eq 'windsurf') { return (Join-Path $base '.windsurf/skills') }
    if ($Name -eq 'opencode') { return (Join-Path $base '.opencode/skills') }
  }
  throw "invalid agent '$Name'"
}

$agents = @()
foreach ($raw in ($Agent | ForEach-Object { $_ -split '[,\s]+' })) {
  if ([string]::IsNullOrWhiteSpace($raw)) { continue }
  $name = ConvertTo-CanonicalAgent $raw
  if ($validAgents -notcontains $name) { throw "invalid agent '$raw'; expected one of $($validAgents -join ', ')" }
  if ($name -eq 'all') {
    $agents = $canonicalAgents
    break
  }
  if ($agents -notcontains $name) { $agents += $name }
}
if ($agents.Count -eq 0) { throw 'at least one agent is required' }

$tmpRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('pixelcraft-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $tmpRoot -Force | Out-Null

try {
  $zipPath = Join-Path $tmpRoot 'pixelcraft.zip'
  if ($Archive) {
    if (-not (Test-Path -LiteralPath $Archive -PathType Leaf)) { throw "archive not found: $Archive" }
    Copy-Item -LiteralPath $Archive -Destination $zipPath
  } else {
    $uri = "https://github.com/$Repo/archive/$Ref.zip"
    Invoke-WebRequest -Uri $uri -OutFile $zipPath -UseBasicParsing
  }

  Expand-Archive -LiteralPath $zipPath -DestinationPath $tmpRoot -Force
  $sourceRoot = Get-ChildItem -LiteralPath $tmpRoot -Directory |
    Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName 'skills') -PathType Container } |
    Select-Object -First 1
  if ($null -eq $sourceRoot) { throw 'archive does not contain a skills directory' }
  $skillsRoot = Join-Path $sourceRoot.FullName 'skills'

  $available = @()
  Get-ChildItem -LiteralPath $skillsRoot -Directory |
    Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName 'SKILL.md') -PathType Leaf } |
    Sort-Object Name |
    ForEach-Object { $available += $_.Name }
  if ($available.Count -eq 0) { throw 'no skills found in archive' }

  $requested = @()
  $useAll = $false
  foreach ($raw in ($Skill | ForEach-Object { $_ -split '[,\s]+' })) {
    if ([string]::IsNullOrWhiteSpace($raw)) { continue }
    $name = $raw.Trim()
    if ($name -ieq 'all') {
      $useAll = $true
      break
    }
    if ($available -notcontains $name) { throw "unknown skill '$name'; available: $($available -join ', ')" }
    if ($requested -notcontains $name) { $requested += $name }
  }

  $selected = @()
  if ($useAll) {
    foreach ($name in $available) { $selected += [pscustomobject]@{ Name = $name; Auto = $false } }
  } else {
    $injected = @()
    foreach ($core in @('pixelcraft', 'pixelcraft-plan')) {
      if (($available -contains $core) -and ($requested -notcontains $core)) { $injected += $core }
    }
    if ($injected.Count -gt 0) {
      Write-Host "note: including required core skill(s): $($injected -join ', ')"
      foreach ($name in $injected) { $selected += [pscustomobject]@{ Name = $name; Auto = $true } }
    }
    foreach ($name in $requested) { $selected += [pscustomobject]@{ Name = $name; Auto = $false } }
  }
  if ($selected.Count -eq 0) { throw 'at least one skill is required' }

  $copySkill = {
    param([string]$Name, [string]$DestinationRoot, [bool]$IsAuto)
    $source = Join-Path $skillsRoot $Name
    $destination = Join-Path $DestinationRoot $Name

    if (Test-ReparsePoint $source) { throw "source skill directory is a symlink: $source; refusing to install through it" }
    if (Test-ReparsePoint $DestinationRoot) { throw "target skills directory is a symlink: $DestinationRoot; refusing to install through it" }

    $exists = Test-AnyPath $destination
    $isLink = Test-ReparsePoint $destination
    if ($IsAuto -and $exists) {
      $kind = if ($isLink) { 'existing symlink' } else { 'existing install' }
      $prefix = if ($DryRun) { 'dry-run: ' } else { '' }
      Write-Host "${prefix}skipped auto-added ${kind}: $Name -> $destination"
      return
    }
    if ($isLink) { throw "installed skill directory is a symlink: $destination; refusing to install through it" }

    if ($DryRun) {
      if ($exists -and -not $Force) {
        Write-Host "dry-run: skipped existing $Name -> $destination (use -Force to replace)"
      } else {
        Write-Host "dry-run: $Name -> $destination"
      }
      return
    }

    if (-not (Test-AnyPath $DestinationRoot)) { New-Item -ItemType Directory -Path $DestinationRoot -Force | Out-Null }
    if (Test-ReparsePoint $DestinationRoot) { throw "target skills directory is a symlink: $DestinationRoot; refusing to install through it" }
    if ($exists -and -not $Force) {
      Write-Host "skipped existing: $Name -> $destination (use -Force to replace)"
      return
    }
    if ($exists) { Remove-Item -LiteralPath $destination -Recurse -Force }
    Copy-Item -LiteralPath $source -Destination $destination -Recurse
    Write-Host "installed: $Name -> $destination"
  }

  $targets = @()
  foreach ($name in $agents) {
    $target = Get-TargetRoot $name ([bool]$Global)
    if ($targets -notcontains $target) { $targets += $target }
  }

  foreach ($target in $targets) {
    foreach ($entry in $selected) {
      & $copySkill ($entry.Name) $target ($entry.Auto)
    }
  }
} finally {
  Remove-Item -LiteralPath $tmpRoot -Recurse -Force -ErrorAction SilentlyContinue
}
