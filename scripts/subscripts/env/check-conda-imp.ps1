Set-StrictMode -Version Latest

$hashFile = "$PSScriptRoot\parameters\last-import"

git fetch origin *>$null
$originHash = git rev-parse origin/main

if (!(Test-Path $hashFile)) {
    Write-Host "[check-conda-imported] Creating local hash record for first-time setup: $originHash"
    Set-Content -Path $hashFile -Value $originHash
}

$storedHash = Get-Content $hashFile | ForEach-Object { $_.Trim() }

if ($storedHash -ne $originHash) {
    Write-Host "Error: Conda environment outdated. Please run scripts/sync-work.ps1 --pull | --merge to update."
    exit 1
}

Write-Host "Local conda environment is up to date."
exit 0
