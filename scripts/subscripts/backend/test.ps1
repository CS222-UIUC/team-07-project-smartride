Set-StrictMode -Version Latest

if ($env:SMARTRIDE_ENTRYPOINT -ne "backend-main") {
    Write-Host "Error: scripts/subscripts/backend/test.ps1 must be run via scripts/backend.ps1 or scripts/auto.ps1"
    exit 1
}

# Move to backend directory
Set-Location ../../../backend

# Activate conda env
conda activate smartride-backend

# Run pytest with coverage
coverage run -m pytest --cov=server tests/
coverage report

Set-Location ../scripts/subscripts/backend