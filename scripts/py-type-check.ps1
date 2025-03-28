Set-Location ..

# Run Ruff (fix and diff)
Write-Host "`n=== Running Ruff Fix ===`n"
ruff check backend --diff
ruff check backend --fix

# Run mypy
Write-Host "`n=== Running mypy ===`n"
mypy backend