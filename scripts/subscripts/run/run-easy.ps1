Set-StrictMode -Version Latest

if ($env:SMARTRIDE_ENTRYPOINT -ne "run-main") {
    Write-Host "Error: scripts/subscripts/run/run-easy.ps1 must be run via scripts/run.ps1"
    exit 1
}

# Start backend
Write-Host "Starting backend..."
Start-Process powershell -ArgumentList @"
cd backend
conda activate smartride-backend
python -m server.app
"@

# Start frontend
Write-Host "Starting frontend..."
Start-Process powershell -ArgumentList @"
cd frontend
pnpm install
pnpm run dev
"@

# Start ngrok
Write-Host "Starting ngrok..."
Start-Process powershell -ArgumentList @"
ngrok http 5173
"@

Pop-Location