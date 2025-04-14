Push-Location "$PSScriptRoot/../../../frontend"

Write-Host "[Frontend Build] Building the frontend project..."

pnpm install
pnpm run build

Write-Host "[Frontend Build] The building is complete."

Pop-Location