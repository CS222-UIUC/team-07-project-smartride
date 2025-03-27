# Export updated conda environment (Windows)

Write-Host "[Backend] Exporting conda environment to conda_env_win.yml..."
cd ../backend
conda activate smartride-backend
conda env export --no-builds > conda_env_win.yml
