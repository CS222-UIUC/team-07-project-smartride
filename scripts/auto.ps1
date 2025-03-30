Set-StrictMode -Version Latest

Push-Location "$PSScriptRoot"

Write-Host "Start all workflows..."

& "./backend.ps1"
& "./frontend.ps1"

Write-Host "Complete all workflows..."

Pop-Location
