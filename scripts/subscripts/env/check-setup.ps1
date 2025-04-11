Set-StrictMode -Version Latest

$paramDir = "$PSScriptRoot/parameters"
$lastFile = Join-Path $paramDir "last-setup"
$latestFile = Join-Path $paramDir "latest-setup"

if (-not (Test-Path $lastFile) -or -not (Test-Path $latestFile)) {
    Write-Host "[Check Setup] We do not have any record of you running setup yet. Please run or rerun scripts/setup.ps1." -ForegroundColor Red
    exit 1
}

$last = Get-Content $lastFile -Raw
$latest = Get-Content $latestFile -Raw

try {
    $lastVersion = [version]$last.Trim()
    $latestVersion = [version]$latest.Trim()
}
catch {
    Write-Host "[Check Setup] Setup record is not legal. Please run or rerun scripts/setup.ps1. If problem persists, contact ETwilight." -ForegroundColor Red
    exit 1
}

if ($lastVersion -ge $latestVersion) {
    Write-Host "[Check Setup] Setup is up-to-date."
    exit 0
}
else {
    Write-Host "[Check Setup] Your last run of setup is with a way older version. Please rerun scripts/setup.ps1." -ForegroundColor Red
    exit 1
}
