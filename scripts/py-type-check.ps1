Set-Location ..

# Run Ruff (fix and diff)
Write-Host "`n=== Running Ruff Fix ===`n"
ruff check backend --fix --diff

# Run mypy
Write-Host "`n=== Running mypy ===`n"
mypy backend