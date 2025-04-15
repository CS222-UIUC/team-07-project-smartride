param ()

Set-StrictMode -Version Latest

Push-Location "$PSScriptRoot"

& "$PSScriptRoot/subscripts/setup/check-setup.ps1"
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "`n[PrPrep] Preparing project before submitting PR...`n"

Write-Host "`n[PrPrep] Running linters and static checks...`n"
& ./check.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[Error] Lint/check failed. Aborting."
    Pop-Location
    exit 1
}

Write-Host "[PrPrep] Running formatters..."
& ./formatter.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[Error] Formatter failed. Aborting."
    Pop-Location
    exit 1
}

Write-Host "[PrPrep] Generate a build for frontend and capacitor..."


Write-Host "[PrPrep] Locking current conda environment..."
$env:SMARTRIDE_ENTRYPOINT = "pr-prep"
Push-Location "$PSScriptRoot/subscripts/env"
& "./lock-conda.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "[Error] Failed to lock conda environment. Aborting."
    Pop-Location
    Pop-Location
    exit 1
}
Pop-Location

Write-Host "[PrPrep] Uploading team google drive files..."
& ./drive.ps1 --upload
if ($LASTEXITCODE -ne 0) {
    Write-Host "[Error] Failed to upload team google drive files. Aborting."
    Pop-Location
    exit 1
}

Write-Host "[PrPrep] Cleaning all legacy parameter files..."
Push-Location "$PSScriptRoot/subscripts"
& "./legacy-cleaner.ps1"
Pop-Location

Write-Host "[PrPrep] PR preparation complete. You may now submit your pull request."
Pop-Location
