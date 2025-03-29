Set-StrictMode -Version Latest

Push-Location "$PSScriptRoot/subscripts"

Write-Host "Start frontend workflows..."

& "./frontend-lint.ps1"
& "./frontend-test.ps1"

Write-Host "Complete frontend workflows..."

Pop-Location
