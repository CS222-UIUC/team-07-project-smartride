Set-Location ../backend

# Run Ruff (fix and diff)
Write-Host "`n=== Running Ruff Fix ===`n"
ruff check server --diff
ruff check server --fix

# Run mypy
Write-Host "`n=== Running mypy ===`n"
mypy server

Set-Location ../scripts