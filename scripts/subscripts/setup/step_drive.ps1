Push-Location "$PSScriptRoot/../.."

Write-Host "[Setup] Downloading team Google Drive files..."
& "./drive.ps1" --download

Pop-Location