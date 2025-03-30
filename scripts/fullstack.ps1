Set-StrictMode -Version Latest

$ErrorActionPreference = "Stop"

Push-Location "$PSScriptRoot"

Write-Host "Start all workflows..."

& "./backend.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend workflow failed, stop executing auto.ps1"
    exit $LASTEXITCODE
}

& "./frontend.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend workflow failed, stop exeecuting auto.ps1"
    exit $LASTEXITCODE
}

Write-Host "All workflows are completed."

Pop-Location
