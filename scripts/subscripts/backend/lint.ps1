Set-StrictMode -Version Latest

if ($env:SMARTRIDE_ENTRYPOINT -ne "backend-main") {
    Write-Host "Error: scripts/subscripts/backend/lint.ps1 must be run via scripts/check.ps1 with no parameter, or with --backend or --fullstack parameters."
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