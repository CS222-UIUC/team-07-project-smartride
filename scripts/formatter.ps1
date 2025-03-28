Set-Location ..

Write-Host "`n=== Formatting Python Backend (ruff) ===`n"
ruff format backend

Write-Host "`n=== Formatting Frontend (prettier) ===`n"
Set-Location frontend
pnpm prettier --write "**/*.{ts,tsx,css}"

Set-Location ..