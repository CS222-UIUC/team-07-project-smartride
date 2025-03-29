Set-StrictMode -Version Latest

Push-Location "$PSScriptRoot/../../frontend"
pnpm install
pnpm lint
Pop-Location
