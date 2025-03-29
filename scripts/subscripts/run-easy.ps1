Set-StrictMode -Version Latest

$marker = "$PSScriptRoot\parameters\run-from-run"
if (!(Test-Path $marker) -or (Get-Content $marker).Trim() -ne "1") {
    Write-Host "Error: run-easy.ps1 must be run via run.ps1 --easy | --full"
    Set-Content -Path $marker -Value "0"
    exit 1
}

Set-Content -Path $marker -Value "0"

$allowFile = "$PSScriptRoot\parameters\allow-easy"
if (!(Test-Path $allowFile) -or (Get-Content $allowFile).Trim() -ne "1") {
    Write-Host "Error: Cannot run easy mode. Please run full setup first by run.ps1 --full"
    Set-Content -Path $allowFile -Value "0"
    exit 1
}

# Pull latest Git changes
Write-Host "Pulling latest changes from git..."
Push-Location "../.."
git pull
Pop-Location

# Start backend
Write-Host "Starting backend..."
Start-Process powershell -ArgumentList @"
cd ../../backend
conda activate smartride-backend
python -m server.app
"@

# Start frontend
Write-Host "Starting frontend..."
Start-Process powershell -ArgumentList @"
cd ../../frontend
pnpm install
pnpm run dev
"@

# Start ngrok
Write-Host "Starting ngrok..."
Start-Process powershell -ArgumentList @"
cd ../..
ngrok http 5173
"@
