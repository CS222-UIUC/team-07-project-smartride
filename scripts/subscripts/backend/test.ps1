Set-StrictMode -Version Latest

if ($env:SMARTRIDE_ENTRYPOINT -ne "backend-main") {
    Write-Host "Error: scripts/subscripts/backend/test.ps1 must be run via scripts/check.ps1 with no parameter, or with --backend or --fullstack parameters."
    exit 1
}

# Move to backend directory
Push-Location "$PSScriptRoot/../../../backend"

# Activate conda env
conda activate smartride-backend

# Run pytest with coverage
pytest --cov=server --cov-report=term --cov-report=html --rich tests/
start "htmlcov/index.html"

Pop-Location