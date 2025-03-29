Set-StrictMode -Version Latest

Push-Location "$PSScriptRoot/../../frontend"
pnpm install
pnpm test
Pop-Location
