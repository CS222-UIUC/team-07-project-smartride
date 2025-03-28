# Export updated conda environment (Windows)

Write-Host "[Backend] Exporting conda environment to conda_env_win.yml..."
Set-Location ../backend
conda activate smartride-backend
conda env export --no-builds | Select-String -NotMatch "^prefix:" > conda_env_win.yml
# Set-Location ../scripts/python
# python conda_win2mac.py