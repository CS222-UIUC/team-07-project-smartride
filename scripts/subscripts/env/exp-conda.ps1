Set-StrictMode -Version Latest

if ($env:SMARTRIDE_ENTRYPOINT -ne "pr-prep") {
    Write-Host "Error: scripts/subscripts/env/exp-conda.ps1 must be run via scripts/pr-prep.ps1"
    exit 1
}

# It is strictly prohibited to export before import, which is a behavior like git push before git pull
& "$PSScriptRoot/check-conda-imp.ps1"
if ($LASTEXITCODE -ne 0) { exit 1 }

# Export updated conda environment (Windows)
Push-Location python

Write-Host "[Export Conda] Exporting conda environment to conda_env.yml..."
$env:CONDA_ENV_REL_PATH = "../../../../backend/conda_env.yml"
$env:CONDA_LOCK_REL_PATH = "../../../../backend/conda_lock.yml"
conda activate smartride-backend
conda env export --from-history | Out-File $env:CONDA_ENV_REL_PATH -Encoding utf8
Write-Host "[Export Conda] Post-processing formats and generating platform selectors..."
python conda_channel_cleaner.py $env:CONDA_ENV_REL_PATH
python conda_depver_remover.py $env:CONDA_ENV_REL_PATH
python conda_platform_analyzer.py $env:CONDA_ENV_REL_PATH --no_cache_output
python conda_pips_filler.py $env:CONDA_ENV_REL_PATH
python conda_yml_formatter.py $env:CONDA_ENV_REL_PATH
Write-Host "[Export Conda] Locking conda environment..."
conda-lock lock --mamba `
  --file $env:CONDA_ENV_REL_PATH `
  --platform win-64 `
  --platform linux-64 `
  --platform osx-64 `
  --lockfile $env:CONDA_LOCK_REL_PATH
Pop-Location

Write-Host "[Export Conda] The conda environment is successfully exported."