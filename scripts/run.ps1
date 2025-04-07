Set-StrictMode -Version Latest

& "$PSScriptRoot/subscripts/env/check-conda-imp.ps1"
if ($LASTEXITCODE -ne 0) { exit 1 }

$env:SMARTRIDE_ENTRYPOINT = "run-main"

Push-Location "$PSScriptRoot/subscripts/run"
& "./run-easy.ps1"
Pop-Location
