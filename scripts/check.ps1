Set-StrictMode -Version Latest

if ($args.Count -eq 0) {
    $mode = "--fullstack"
}
elseif ($args.Count -eq 1) {
    $mode = $args[0]
}
else {
    Write-Host "Usage: check.ps1 [--backend | --frontend | --fullstack]"
    exit 1
}

if ($mode -ne "--backend" -and $mode -ne "--frontend" -and $mode -ne "--fullstack") {
    Write-Host "Invalid mode: $mode"
    Write-Host "Usage: check.ps1 [--backend | --frontend | --fullstack]"
    exit 1
}

if ($mode -eq "--backend" -or $mode -eq "--fullstack") {
    & "$PSScriptRoot/subscripts/env/check-conda-imp.ps1"
    if ($LASTEXITCODE -ne 0) { exit 1 }

    $env:SMARTRIDE_ENTRYPOINT = "backend-main"
    Push-Location "$PSScriptRoot/subscripts/backend"

    Write-Host "Start backend workflows..."

    & "./test.ps1"
    & "./lint.ps1"

    Write-Host "Backend workflows are completed."

    Pop-Location
}

if ($mode -eq "--frontend" -or $mode -eq "--fullstack") {
    $env:SMARTRIDE_ENTRYPOINT = "frontend-main"
    Push-Location "$PSScriptRoot/subscripts/frontend"

    Write-Host "Start frontend workflows..."

    & "./lint.ps1"
    & "./test.ps1"

    Write-Host "Frontend workflows are completed."

    Pop-Location
}
