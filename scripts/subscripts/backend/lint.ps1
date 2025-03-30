Set-StrictMode -Version Latest

if ($env:SMARTRIDE_ENTRYPOINT -ne "backend-main") {
    Write-Host "Error: scripts/subscripts/backend/lint.ps1 must be run via scripts/backend.ps1 or scripts/auto.ps1"
    exit 1
}

Set-Location ../../../backend

# Run Ruff (fix and diff)
Write-Host "`n=== Running Ruff Fix ===`n"
ruff check server --diff
ruff check server --fix

# Run mypy
Write-Host "`n=== Running mypy ===`n"
mypy server

Set-Location ../scripts/subscripts/backend