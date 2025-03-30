Set-StrictMode -Version Latest

if ($args.Count -ne 1) {
    Write-Host "Usage: run.ps1 --full | --easy"
    exit 1
}

$mode = $args[0]

if ($mode -ne "--full" -and $mode -ne "--easy") {
    Write-Host "Invalid mode: $mode"
    Write-Host "Usage: run.ps1 --full | --easy"
    exit 1
}

if ($mode -eq "--full") {
    Write-Host "Running full setup (conda env update + run-easy)..."

    Push-Location "$PSScriptRoot/../backend"
    conda activate smartride-backend

    $platform = (Get-ComputerInfo -Property OsName).OsName
    if ($platform -match "Windows") {
        Write-Host "Using conda_env_win.yml"
        conda env update --file conda_env_win.yml --prune
    } else {
        Write-Host "Using conda_env_mac.yml"
        conda env update --file conda_env_mac.yml --prune
    }

    Pop-Location

    Set-Content -Path "$PSScriptRoot\subscripts\run\parameters\allow-easy" -Value "1"
} elseif ($mode -eq "--easy") {
    Write-Host "Running in easy mode (skip conda env update)..."
}

$env:SMARTRIDE_ENTRYPOINT = "run-main"

Push-Location "$PSScriptRoot/subscripts/run"
& "./run-easy.ps1"
Pop-Location
