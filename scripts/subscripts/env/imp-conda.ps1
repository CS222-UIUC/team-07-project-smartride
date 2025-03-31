Set-StrictMode -Version Latest

if ($env:SMARTRIDE_ENTRYPOINT -ne "sync-work") {
    Write-Host "Error: scripts/subscripts/env/imp.ps1 must be run via scripts/sync-work.ps1 --(merge|pull)"
    exit 1
}

Write-Host "Importing newest update on smartride-backend conda environment..."

Push-Location "$PSScriptRoot/../../../backend"
conda activate smartride-backend

Write-Host "Using conda_env_win.yml"
conda env update --file conda_env_win.yml

Pop-Location

Set-Content -Path "$PSScriptRoot/parameters/conda-imported" -Value "1"
Write-Host "[Import Conda] Environment imported. Flag set to 1."

Write-Host "Conda import completed."