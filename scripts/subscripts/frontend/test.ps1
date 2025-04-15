Set-StrictMode -Version Latest

if ($env:SMARTRIDE_ENTRYPOINT -ne "frontend-main") {
    Write-Host "Error: scripts/subscripts/frontend/test.ps1 must be run via scripts/check.ps1 with no parameter, or with --frontend or --fullstack parameters."
    exit 1
}

Push-Location "$PSScriptRoot/../../../frontend"
pnpm install > $null
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n[Error] pnpm install failed. Aborting."
    Pop-Location
    exit 1
}
pnpm test --coverage
Start-Process coverage/index.html
Pop-Location
