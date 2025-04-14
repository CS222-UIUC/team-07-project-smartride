param (
    [string]$Platform
)

Set-StrictMode -Version Latest

if ($env:SMARTRIDE_ENTRYPOINT -ne "run-main") {
    Write-Host "Error: scripts/subscripts/run/run-build.ps1 must be run via scripts/run.ps1"
    exit 1
}

if ($Platform -notin @("--web", "--android", "--ios")) {
    Write-Host "Error: Invalid option. Use --web, --android or --ios."
    exit 1
}

# Step 1: Build frontend
Push-Location "$PSScriptRoot/../frontend"
& "./build.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to build project. Aborting..."
    exit 1
}
Pop-Location

# Step 2: Fetch WLAN IP
$wlanIp = & python "$PSScriptRoot/python/fetch_ip.py"
if ($LASTEXITCODE -ne 0 -or -not $wlanIp) {
    Write-Host "Error: fetch_ip.py failed or returned empty string."
    exit 1
}
Write-Host "[INFO] Retrieved WLAN IP: $wlanIp"

# Step 3: Only update VITE_WLAN_IP in .env.local
$envPath = "$PSScriptRoot/../../../.env.local"
$envLines = Get-Content $envPath

$found = $false
$updatedLines = $envLines | ForEach-Object {
    if ($_ -match '^VITE_WLAN_IP=') {
        $found = $true
        "VITE_WLAN_IP=`"$wlanIp`""
    } else {
        $_
    }
}
if (-not $found) {
    $updatedLines += "VITE_WLAN_IP=`"$wlanIp`""
}
$updatedLines | Set-Content $envPath -Encoding UTF8

Push-Location "$PSScriptRoot/../../.."

# Step 4: Start backend
Write-Host "Starting backend..."
Start-Process powershell -ArgumentList @"
cd backend
conda activate smartride-backend
python -m server.app
Write-Host 'Press Enter to exit...'
Read-Host
"@

# Step 5: Start frontend preview or cap run
Write-Host "Starting frontend..."
if ($Platform -eq "--android" -or $Platform -eq "--ios") {
    $deployType = Get-Content frontend/.env.local | Where-Object { $_ -match '^VITE_DEPLOY_TARGET=' } | ForEach-Object { ($_ -split '=')[1].Trim('"') }

    if ($deployType -eq "MACHINE") {
        Write-Host "[SKIP] Target is MACHINE. Skipping 'npx cap run'."
    } else {
        $platformStr = if ($Platform -eq "--android") { "android" } else { "ios" }
        Start-Process powershell -ArgumentList @"
cd frontend
pnpm install
pnpm --package="@capacitor/cli" dlx capacitor run $platformStr
Write-Host 'Press Enter to exit...'
Read-Host
"@
    }
} else {
    Start-Process powershell -ArgumentList @"
cd frontend
pnpm install
pnpm preview
Write-Host 'Press Enter to exit...'
Read-Host
"@
}

Pop-Location
