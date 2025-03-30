Set-StrictMode -Version Latest

$env:SMARTRIDE_ENTRYPOINT = "frontend-main"

Push-Location "$PSScriptRoot/subscripts/frontend"

Write-Host "Start frontend workflows..."

& "./lint.ps1"
& "./test.ps1"

Write-Host "Complete frontend workflows..."

Pop-Location
