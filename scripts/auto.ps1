Set-StrictMode -Version Latest

Push-Location "$PSScriptRoot"

Write-Host "Start all workflows..."

& "./frontend.ps1"
& "./backend.ps1"

Write-Host "Complete all workflows..."

Pop-Location
