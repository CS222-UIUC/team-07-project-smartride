Set-StrictMode -Version Latest

$paramDir = "$PSScriptRoot/parameters"
$lastFile = Join-Path $paramDir "last-setup"
$latestFile = Join-Path $paramDir "latest-setup"

if (-not (Test-Path $lastFile) -or -not (Test-Path $latestFile)) {
    Write-Host "[Check Setup] Missing last-setup or latest-setup file."
    exit 1
}

$last = Get-Content $lastFile -Raw
$latest = Get-Content $latestFile -Raw

if ($last.Trim() -eq $latest.Trim()) {
    Write-Host "[Check Setup] Setup hash is up-to-date."
    exit 0
}
else {
    Write-Host "[Check Setup] Setup hash is outdated. Please rerun scripts/setup.ps1."
    exit 1
}
