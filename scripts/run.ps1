Set-StrictMode -Version Latest

& "$PSScriptRoot/subscripts/env/check-conda-imp.ps1"
if ($LASTEXITCODE -ne 0) { exit 1 }

$env:SMARTRIDE_ENTRYPOINT = "run-main"

if ($args -contains '--build') {
    Push-Location "$PSScriptRoot/subscripts/run"
    & "./run-build.ps1"
    Pop-Location
}
elseif ($args.Count -eq 0 -or $args -contains '--dev') {
    Push-Location "$PSScriptRoot/subscripts/run"
    & "./run-dev.ps1"
    Pop-Location
}
else {
    Write-Host "Invalid argument. Please use '--build' or '--dev' (default if no parameter) as a parameter." -ForegroundColor Red
    exit 1
}
