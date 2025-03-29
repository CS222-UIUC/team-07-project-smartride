Write-Host "`n=== Formatting Python Backend (ruff) ===`n"
Set-Location ../backend
conda activate smartride-backend
ruff format server

Write-Host "`n=== Formatting Frontend (prettier) ===`n"
Set-Location ../frontend
pnpm prettier --write "**/*.{ts,tsx,css}"

Set-Location ../scripts