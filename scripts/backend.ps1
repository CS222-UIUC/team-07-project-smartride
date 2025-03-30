Set-StrictMode -Version Latest

$allowFile = "$PSScriptRoot\scripts\subscripts\run\parameters\allow-easy"
if (!(Test-Path $allowFile) -or (Get-Content $allowFile).Trim() -ne "1") {
    Write-Host "Error: Cannot perform backend check workflow. Please run full setup first by run.ps1 --full"
    Set-Content -Path $allowFile -Value "0"
    exit 1
}

$env:SMARTRIDE_ENTRYPOINT = "backend-main"

Push-Location "$PSScriptRoot/subscripts/backend"

Write-Host "Start backend workflows..."

& "./test.ps1"
& "./lint.ps1"
& "./upconda.ps1"

Write-Host "Complete backend workflows..."

Pop-Location
