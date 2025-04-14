param (
  [Parameter(Mandatory=$false)]
  [ValidateSet("--dev", "--web", "--android", "--ios")]
  [string]$Mode = "--dev"
)

Set-StrictMode -Version Latest

# Ensure conda env is imported
& "$PSScriptRoot/subscripts/env/check-conda-imp.ps1"
if ($LASTEXITCODE -ne 0) { exit 1 }

# Write project mode to .env.local
$envFile = "$PSScriptRoot/../frontend/.env.local"
$projectMode = if ($Mode -eq "--dev") { "DEV" } else { "BUILD" }

$lines = Get-Content $envFile
$found = $false
$updated = $lines | ForEach-Object {
  if ($_ -match '^VITE_PROJECT_MODE=') {
    $found = $true
    "VITE_PROJECT_MODE=`"$projectMode`""
  } else {
    $_
  }
}
if (-not $found) {
  $updated += "VITE_PROJECT_MODE=`"$projectMode`""
}
$updated | Set-Content $envFile -Encoding UTF8
Write-Host "[INFO] Set VITE_PROJECT_MODE=$projectMode"

# Set flag for subprocesses
$env:SMARTRIDE_ENTRYPOINT = "run-main"

# Run by mode
Push-Location "$PSScriptRoot/subscripts/run"

switch ($Mode) {
  "--dev"     { & "./run-dev.ps1" }
  "--web"     { & "./run-build.ps1" --web }
  "--android" { & "./run-build.ps1" --android }
  "--ios"     { & "./run-build.ps1" --ios }
  default {
    Write-Host "Invalid argument: $Mode" -ForegroundColor Red
    Write-Host "Valid options are: --dev, --web, --android, --ios" -ForegroundColor Yellow
    exit 1
  }
}

Pop-Location
