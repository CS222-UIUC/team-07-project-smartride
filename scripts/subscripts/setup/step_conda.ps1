conda activate base
if ($LASTEXITCODE -ne 0) {
    Write-Host "[Error] Is your conda working? You may want to run ./conda init in the Scripts subdirectory of your conda directory." -ForegroundColor Red
    exit 1
}
conda install -n base -c conda-forge mamba conda-lock -y
if ($LASTEXITCODE -ne 0) {
    Write-Host "[Error] We failed to install conda-lock and mamba for your conda." -ForegroundColor Red
    exit 1
}
Push-Location "$PSScriptRoot/"
& "./check-setup.ps1" -step step_conda *> $null
if ($LASTEXITCODE -ne 0) {
    # The first time setting up (after installing pnpm, conda, rclone), user might be using the legacy conda environment
    # Check if 'smartride-backend' environment exists, if yes, uninstall
    $envExists = conda env list | Select-String "^\s*smartride-backend\s"
    if ($envExists) {
        Write-Host "[Setup] First time setting up (since version changed). Reinstalling smartride-backend conda environment..." -ForegroundColor Blue
        Write-Host "[Setup] Uninstalling smartride-backend conda environment..."
        conda env remove -n smartride-backend -y
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[Error] We failed to remove existing smartride-backend environment. You should go to the envs folder of your conda environment and manually delete this folder." -ForegroundColor Red
            Pop-Location
            exit 1
        }
    }
    conda clean --all -y
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[Error] We cannot clean your conda environments." -ForegroundColor Red
        Pop-Location
        exit 1
    }
}
Pop-Location

Push-Location "$PSScriptRoot/../../../backend"
Write-Host "[Setup] Installing or updating smartride-backend conda environment..."
conda activate base
conda-lock install --mamba conda-lock.yml --name smartride-backend
if ($LASTEXITCODE -ne 0) {
    Write-Host "[Error] We failed to install smartride-backend with conda-lock. Contact administrator." -ForegroundColor Red
    Pop-Location
    exit 1
}
conda activate smartride-backend
if ($LASTEXITCODE -ne 0) {
    Write-Host "[Error] We failed to activate installed smartride-backend environment." -ForegroundColor Red
    Pop-Location
    exit 1
}
Write-Host "[Setup] smartride-backend conda environment is successfully installed and activated." -ForegroundColor Green
Pop-Location

exit 0