param ()

Set-StrictMode -Version Latest

Push-Location "$PSScriptRoot"

Write-Host "`n[PrPrep] Although not mandatory, it is always recommended to first run sync-work.ps1 --merge to merge main changes."

Write-Host "`n[PrPrep] Preparing project before submitting PR...`n"

Write-Host "`n[PrPrep] Running linters and static checks...`n"
& check.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[Error] Lint/check failed. Aborting."
    Pop-Location
    exit 1
}

Write-Host "[PrPrep] Running formatters..."
& formatter.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[Error] Formatter failed. Aborting."
    Pop-Location
    exit 1
}

Write-Host "[PrPrep] Exporting current conda environment..."
$env:SMARTRIDE_ENTRYPOINT = "pr-prep"
Push-Location "$PSScriptRoot/subscripts/env"
& exp-conda.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[Error] Failed to export conda environment. Aborting."
    Pop-Location
    Pop-Location
    exit 1
}
Pop-Location

Write-Host "[PrPrep] Uploading team google drive files..."
& drive.ps1 --upload
if ($LASTEXITCODE -ne 0) {
    Write-Host "[Error] Failed to upload team google drive files. Aborting."
    Pop-Location
    exit 1
}

Write-Host "[PrPrep] PR preparation complete. You may now submit your pull request."
Pop-Location
