Set-StrictMode -Version Latest

if ($env:SMARTRIDE_ENTRYPOINT -ne "run-main") {
    Write-Host "Error: scripts/subscripts/run/run-dev.ps1 must be run via scripts/run.ps1"
    exit 1
}

Push-Location "$PSScriptRoot/../../.."

# Start backend
Write-Host "Starting backend..."
Start-Process powershell -ArgumentList @"
cd backend
conda activate smartride-backend
python -m server.app
Write-Host 'Press Enter to exit...'
Read-Host
"@

# Start frontend
Write-Host "Starting frontend..."
Start-Process powershell -ArgumentList @"
cd frontend
pnpm install
pnpm run dev
Write-Host 'Press Enter to exit...'
Read-Host
"@

# Start ngrok
Write-Host "Starting ngrok..."
Start-Process powershell -ArgumentList @"
ngrok http 5173
Write-Host 'Press Enter to exit...'
Read-Host
"@

Pop-Location