Set-StrictMode -Version Latest

if ($env:SMARTRIDE_ENTRYPOINT -ne "pr-prep" -and $env:SMARTRIDE_ENTRYPOINT -ne "conda-op") {
  Write-Host "Error: scripts/subscripts/env/lock-conda.ps1 must be run via scripts/pr-prep.ps1 or scripts/conda-op.ps1"
  exit 1
}

# # It is strictly prohibited to lock before import, which is a behavior like git push before git pull
& "$PSScriptRoot/check-conda-imp.ps1"
if ($LASTEXITCODE -ne 0) { exit 1 }

# Lock updated conda environment (Windows)
Write-Host "[Lock Conda] Preparing to lock conda environment..."
Push-Location python

$env:CONDA_ENV_REL_PATH = "../../../../backend/conda-env.yml"
$env:CONDA_LOCK_REL_PATH = "../../../../backend/conda-lock.yml"
conda activate smartride-backend
Write-Host "[Lock Conda] Post-processing yaml file..."
python conda_channel_cleaner.py $env:CONDA_ENV_REL_PATH
python conda_pips_filler.py $env:CONDA_ENV_REL_PATH
python conda_yml_formatter.py $env:CONDA_ENV_REL_PATH
Write-Host "[Lock Conda] Locking conda environment..."
conda activate base
conda-lock lock --mamba `
  --file $env:CONDA_ENV_REL_PATH `
  --platform win-64 `
  --platform linux-64 `
  --platform osx-64 `
  --platform osx-arm64 `
  --lockfile $env:CONDA_LOCK_REL_PATH 2>&1 1>$null
Pop-Location

Write-Host "[Lock Conda] The conda environment is successfully locked."