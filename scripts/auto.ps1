Set-StrictMode -Version Latest

Push-Location "$PSScriptRoot/"
& "./check.ps1" --fullstack
& "./formatter.ps1"
Pop-Location
