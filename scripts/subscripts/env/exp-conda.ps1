Set-StrictMode -Version Latest

if ($env:SMARTRIDE_ENTRYPOINT -ne "pr-prep") {
    Write-Host "Error: scripts/subscripts/env/exp-conda.ps1 must be run via scripts/pr-prep.ps1"
    exit 1
}

# It is strictly prohibited to export before import, which is a behavior like git push before git pull

& "$PSScriptRoot/check-conda-imp.ps1"
if ($LASTEXITCODE -ne 0) { exit 1 }

# Export updated conda environment (Windows)

Write-Host "[Export Conda] Exporting conda environment to conda_env_win.yml..."
Set-Location ../../../backend
conda activate smartride-backend
conda env export --no-builds | Select-String -NotMatch "^prefix:" | Out-File -FilePath conda_env_win.yml -Encoding utf8
Set-Location ../scripts/subscripts/env/python
python conda_win2mac.py
Set-Location ..