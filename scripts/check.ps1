param (
    [Parameter(Mandatory = $false)]
    [ValidateSet("backend", "frontend", "fullstack")]
    [string]$target = "fullstack"
)

Set-StrictMode -Version Latest

if ($target -eq "backend" -or $target -eq "fullstack") {
    $allowFile = "$PSScriptRoot\subscripts\run\parameters\allow-easy"
    if (!(Test-Path $allowFile) -or (Get-Content $allowFile).Trim() -ne "1") {
        Write-Host "Error: Cannot perform backend check workflow. Please run full setup first by run.ps1 --full"
        Set-Content -Path $allowFile -Value "0"
        exit 1
    }

    $env:SMARTRIDE_ENTRYPOINT = "backend-main"
    Push-Location "$PSScriptRoot/subscripts/backend"

    Write-Host "Start backend workflows..."

    & "./test.ps1"
    & "./lint.ps1"
    & "./upconda.ps1"

    Write-Host "Complete backend workflows..."

    Pop-Location
}

if ($target -eq "frontend" -or $target -eq "fullstack") {
    $env:SMARTRIDE_ENTRYPOINT = "frontend-main"
    Push-Location "$PSScriptRoot/subscripts/frontend"

    Write-Host "Start frontend workflows..."

    & "./lint.ps1"
    & "./test.ps1"

    Write-Host "Complete frontend workflows..."

    Pop-Location
}
