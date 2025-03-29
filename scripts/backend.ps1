Set-StrictMode -Version Latest

Push-Location "$PSScriptRoot/subscripts"

Write-Host "Start backend workflows..."

& "./backend-test.ps1"
& "./py-type-check.ps1"
& "./update-conda.ps1"

Write-Host "Complete backend workflows..."

Pop-Location
