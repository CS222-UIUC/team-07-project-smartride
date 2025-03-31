Set-StrictMode -Version Latest

if ($env:SMARTRIDE_ENTRYPOINT -ne "frontend-main") {
    Write-Host "Error: scripts/subscripts/frontend/lint.ps1 must be run via scripts/check.ps1 with no parameter, or with --frontend or --fullstack parameters."
    exit 1
}

Push-Location "$PSScriptRoot/../../../frontend"
pnpm install
pnpm lint
Pop-Location
