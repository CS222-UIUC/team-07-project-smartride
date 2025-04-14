param (
    [string]$step = "step_global"
)

Set-StrictMode -Version Latest

$paramDir = "$PSScriptRoot/parameters"
$requiredFile = Join-Path $paramDir "requiredVersion"
$lastFile = Join-Path $paramDir "lastVersion"
$oldGlobalFile = "$PSScriptRoot/../env/parameters/last-setup"
$versionWriter = Join-Path $PSScriptRoot "version-writer.ps1"

if (-not (Test-Path $requiredFile)) {
    Write-Host "[Check Setup] Missing requiredVersion file. Please contact administrator." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $lastFile) -and -not (Test-Path $oldGlobalFile)) {
    Write-Host "[Check Setup] No setup history found. Please run scripts/setup.ps1." -ForegroundColor Red
    exit 1
}

# Read required versions
$requiredVersions = @{}
Get-Content $requiredFile | ForEach-Object {
    if ($_ -match '^(.*?)=(.*?)$') {
        $requiredVersions[$matches[1]] = $matches[2].Trim()
    }
}

# Read last versions (either full map or old fallback)
$lastVersions = @{}
$usedOldFallback = $false
$fallbackVersion = $null

if (Test-Path $lastFile) {
    Get-Content $lastFile | ForEach-Object {
        if ($_ -match '^(.*?)=(.*?)$') {
            $lastVersions[$matches[1]] = $matches[2].Trim()
        }
    }
}
elseif (Test-Path $oldGlobalFile) {
    try {
        $fallbackVersion = (Get-Content $oldGlobalFile -Raw).Trim()
        $null = [version]$fallbackVersion  # validate
        $usedOldFallback = $true
    }
    catch {
        Write-Host "[Check Setup] Invalid old setup version record. Please rerun scripts/setup.ps1." -ForegroundColor Red
        exit 1
    }
}

# Determine which steps to check
$stepsToCheck = if ($step -eq "step_global") { $requiredVersions.Keys } else { @($step) }

# Replace old fallback version if needed
if ($usedOldFallback) {
    Write-Host "[Check Setup] Detected old setup record. Migrating to per-step version tracking..." -ForegroundColor Yellow
    foreach ($s in $requiredVersions.Keys) {
        & $versionWriter -step $s -version $fallbackVersion
    }
    Remove-Item $oldGlobalFile -Force
    Write-Host "[Check Setup] Migration complete."
}

# Compare
$outdated = @()
foreach ($s in $stepsToCheck) {
    if (-not $requiredVersions.ContainsKey($s)) {
        Write-Host "[Warning] Step '${s}' not found in requiredVersion file. Skipping..." -ForegroundColor Yellow
        continue
    }
    $required = [version]$requiredVersions[$s]
    if ($usedOldFallback) {
        $actual = [version]$fallbackVersion
    } elseif ($lastVersions.ContainsKey($s)) {
        $actual = [version]$lastVersions[$s]
    } else {
        $outdated += $s
        Write-Host "[Outdated] ${s}: missing (required ${required}). Please rerun scripts/setup.ps1 --${s}" -ForegroundColor Red
        continue
    }

    if ($actual -lt $required) {
        $outdated += $s
        Write-Host "[Outdated] ${s}: ${actual} < required ${required}. Please rerun scripts/setup.ps1 --${s}" -ForegroundColor Red
    }
}

if ($outdated.Count -gt 0) {
    Write-Host "[Check Setup] One or more setup steps are outdated." -ForegroundColor Red
    exit 1
} else {
    Write-Host "[Check Setup] Setup is up-to-date." -ForegroundColor Green
    exit 0
}