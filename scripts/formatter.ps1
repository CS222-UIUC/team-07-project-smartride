Write-Host "`nStart backend ruff formatter workflow...`n"
Set-Location ../backend
conda activate smartride-backend
ruff format server
Write-Host "`nBackend ruff formatter workflow are completed.`n"

Write-Host "`nStart frontend prettier formatter workflow...`n"
Set-Location ../frontend
pnpm prettier --write "**/*.{ts,tsx,css}"
Write-Host "`nFrontend prettier formatter workflow are completed.`n"

Set-Location ../scripts
Write-Host "`nAll formatter workflows are completed.`n"