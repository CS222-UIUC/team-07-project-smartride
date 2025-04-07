Set-StrictMode -Version Latest

if ($env:SMARTRIDE_ENTRYPOINT -ne "sync-work") {
    Write-Host "Error: scripts/subscripts/env/imp-conda.ps1 must be run via scripts/sync-work.ps1 --(merge|pull)"
    exit 1
}

Write-Host "[Import Conda] Importing newest update on smartride-backend conda environment..."

Push-Location "$PSScriptRoot/../../../backend"
conda activate smartride-backend

Write-Host "Using conda_env_win.yml"
mamba env update -n smartride-backend -f conda_env_win.yml
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Mamba failed to update conda environment. Aborting."
    Pop-Location
    exit 1
}

Pop-Location

$hashFile = "$PSScriptRoot\parameters\last-import"

$originHash = git rev-parse origin/main
Set-Content -Path $hashFile -Value $originHash
Write-Host "[Import Conda] Conda is successfully imported."