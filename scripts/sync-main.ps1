param (
    [Parameter(Mandatory = $true)]
    [ValidateSet("--pull", "--merge")]
    [string] $Mode
)

Set-StrictMode -Version Latest

Push-Location "$PSScriptRoot"

Write-Host "`n[SyncMain] Starting sync mode: $Mode`n"

if ($Mode -eq "--pull") {
    Write-Host "[Git] Checking out and pulling origin/main..."
    git checkout main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[Error] Failed to checkout main. Aborting."
        Pop-Location
        exit 1
    }
    git pull
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[Error] Failed to pull from origin/main. Aborting."
        Pop-Location
        exit 1
    }
}
elseif ($Mode -eq "--merge") {
    Write-Host "[Git] Fetching and merging origin/main into current branch..."
    git fetch origin
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[Error] Failed to fetch. Aborting."
        Pop-Location
        exit 1
    }
    git merge origin/main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[Error] Merge failed. Please resolve conflicts manually first then run this script again."
        Pop-Location
        exit 1
    }
}

Write-Host "[SyncMain] Importing latest conda environment..."
$env:SMARTRIDE_ENTRYPOINT = "sync-main"
subscripts/env/imp-conda.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[Error] Failed to sync local conda environment. Aborting."
    Pop-Location
    exit 1
}

Write-Host "[SyncMain] Syncing team google drive files..."
drive.ps1 --download
if ($LASTEXITCODE -ne 0) {
    Write-Host "[Error] Failed to sync team google drive files. Aborting."
    Pop-Location
    exit 1
}

Write-Host "[SyncMain] All workflows completed! Happy coding!"
Pop-Location
