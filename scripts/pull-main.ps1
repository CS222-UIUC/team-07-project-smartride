Set-StrictMode -Version Latest

Push-Location "$PSScriptRoot"

Write-Host "[pull-main] Switching to main branch..."
git checkout main
if ($LASTEXITCODE -ne 0) {
    Write-Host "[Error] Failed to checkout main branch. Aborting."
    Pop-Location
    exit 1
}
git pull
if ($LASTEXITCODE -ne 0) {
    Write-Host "[Error] Failed to pull latest commits. Aborting."
    Pop-Location
    exit 1
}

Write-Host "[pull-main] Importing latest conda environment..."
$env:SMARTRIDE_ENTRYPOINT = "pull-main"
scripts/subscripts/env/imp-conda.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[Error] Failed to sync local conda environment. Aborting."
    Pop-Location
    exit 1
}

Write-Host "[pull-main] Syncing team google drive files..."
scripts/drive.ps1 --download
if ($LASTEXITCODE -ne 0) {
    Write-Host "[Error] Failed to sync team google drive files. Aborting."
    Pop-Location
    exit 1
}

Write-Host "[pull-main] All workflows completed! Happy coding!"
Pop-Location
