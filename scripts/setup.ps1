Set-StrictMode -Version Latest

$setupSteps = @("step_rclone", "step_env", "step_cli", "step_conda", "step_drive")
$stepVersions = @{
  "step_rclone" = "1.1"
  "step_env"    = "1.2"
  "step_cli"    = "1.1"
  "step_conda"  = "1.1"
  "step_drive"  = "1.1"
}
$requiredVersions = @{
  "step_rclone" = "1.0"
  "step_env"    = "1.2"
  "step_cli"    = "1.0"
  "step_conda"  = "1.0"
  "step_drive"  = "1.0"
}

$adminMode = $false
$step = "step_all"

if ($args.Count -eq 1) {
    if ($args[0] -eq "--admin") {
        $adminMode = $true
    } elseif ($args[0] -like "--step_*") {
        $step = $args[0].Substring(2)
    } else {
        Write-Host "Invalid argument: $($args[0])" -ForegroundColor Red
        exit 1
    }
} elseif ($args.Count -gt 1) {
    Write-Host "Too many arguments. Only one of --admin or --step_xxx allowed." -ForegroundColor Red
    exit 1
}

# usage: ./setup.ps1 -admin (NOTE: It is single dash)
if ($adminMode) {
    Write-Host "[Setup Admin] This will overwrite the required setup step versions." -ForegroundColor Yellow
    $confirm = Read-Host "[Setup Admin] Do you want to continue? (Y/N)"
    if ($confirm -ne 'Y') {
        Write-Host "[Setup Admin] Aborted."
        exit 0
    }

    $lines = $setupSteps | ForEach-Object {
        "$_=$($requiredVersions[$_])"
    }

    $targetFile = "$PSScriptRoot/subscripts/setup/parameters/requiredVersion"
    Set-Content -Path $targetFile -Value $lines
    Write-Host "[Setup Admin] All required versions written to 'requiredVersion'" -ForegroundColor Cyan
    exit 0
}

$writerPath = "$PSScriptRoot/subscripts/setup/version-writer.ps1"
Push-Location "$PSScriptRoot/subscripts/setup"

$stepsToRun = if ($step -eq "step_all") { $setupSteps } else { @($step) }
foreach ($step in $stepsToRun) {
    Write-Host "[Setup] Running $step..."
    & "./$step.ps1"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[Setup] $step failed. This step is NOT finished." -ForegroundColor Red
        Pop-Location
        exit 1
    }
    & $writerPath -step $step -version $stepVersions[$step]
}
Pop-Location

# Post-action: Completed
Push-Location "$PSScriptRoot/subscripts/setup"
& "./check-setup.ps1"
if ($LASTEXITCODE -eq 0) {
    Write-Host "[Setup] SmartRide setup complete. Please check the 'docs' folder for documentation." -ForegroundColor Green
    Write-Host "[Setup] To run the project, first run './sync-work.ps1 --pull' and then './run.ps1'. Happy coding!"
    Pop-Location
    exit 0
}
Pop-Location
exit 1