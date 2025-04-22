param (
    [Parameter(Mandatory = $true)]
    [ValidateSet("--pull", "--merge")]
    [string] $Mode
)

Set-StrictMode -Version Latest

& "$PSScriptRoot/subscripts/setup/check-setup.ps1"
if ($LASTEXITCODE -ne 0) { exit 1 }

Push-Location "$PSScriptRoot"

Write-Host "`n[SyncWork] Starting sync mode: $Mode`n"

if ($Mode -eq "--pull") {
    Write-Host "[Git] Checking out and pulling origin/main..."
    git checkout main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[SyncWork] Error: Failed to checkout main. Aborting." -ForegroundColor Red
        Pop-Location
        exit 1
    }
    git pull
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[SyncWork] Error: Failed to pull from origin/main. Aborting." -ForegroundColor Red
        Pop-Location
        exit 1
    }
}
elseif ($Mode -eq "--merge") {
    Write-Host "[Git] Fetching and merging origin/main into current branch..."
    git fetch origin
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[SyncWork] Error: Failed to fetch. Aborting." -ForegroundColor Red
        Pop-Location
        exit 1
    }
    git merge origin/main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[SyncWork] Error: Merge failed. Please resolve conflicts manually first then run this script again." -ForegroundColor Red
        Pop-Location
        exit 1
    }
}

Write-Host "[SyncWork] Importing latest conda environment..."
$env:SMARTRIDE_ENTRYPOINT = "sync-work"
Push-Location "$PSScriptRoot/subscripts/env"
& ./imp-conda.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[SyncWork] Error: Failed to sync local conda environment. Aborting." -ForegroundColor Red
    Pop-Location
    Pop-Location
    exit 1
}
Pop-Location

Write-Host "[SyncWork] Downloading team google drive files..."
& ./drive.ps1 --download
if ($LASTEXITCODE -ne 0) {
    Write-Host "[SyncWork] Warning: Failed to download team google drive files." -ForegroundColor Yellow
}

Write-Host "[SyncWork] Installing frontend dependencies via pnpm..."
Push-Location "$PSScriptRoot/../frontend"
pnpm install > $null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[SyncWork] Error: pnpm install failed. Aborting." -ForegroundColor Red
    Pop-Location
    Pop-Location
    exit 1
}
Pop-Location
Write-Host "[SyncWork] pnpm install completed."

Write-Host "[SyncWork] Cleaning all legacy parameter files..."
Push-Location "$PSScriptRoot/subscripts"
& "./legacy-cleaner.ps1"
Pop-Location

Write-Host "[SyncWork] All workflows completed! Happy coding!" -ForegroundColor Green
Pop-Location
