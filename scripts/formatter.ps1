Write-Host "`n[Formatter] Start backend ruff formatter workflow..."
Set-Location ../backend
conda activate smartride-backend
ruff format server
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n[Error] Backend ruff auto-format failed. Aborting."
    Pop-Location
    exit 1
}
Write-Host "`n[Formatter] Backend ruff formatter workflow are completed."

Write-Host "`n[Formatter] Start frontend prettier formatter workflow..."
Set-Location ../frontend
pnpm prettier --write "**/*.{ts,tsx,js,jsx}" 2>&1 |
  Where-Object { $_ -notmatch "\(unchanged\)" -and $_.Trim() -ne "" }

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n[Error] Frontend prettier auto-format failed. Aborting."
    Pop-Location
    exit 1
}
Write-Host "`n[Formatter] Frontend prettier formatter workflow are completed."

Set-Location ../scripts
Write-Host "`n[Formatter] All formatter workflows are completed.`n"