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
    Pop-Location
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

# Step 3: Update VITE_WLAN_IP in .env.auto
$autoEnvPath = "$PSScriptRoot/../../../.env.auto"
$autoEnvLines = Get-Content $autoEnvPath

$found = $false
$updatedLines = $autoEnvLines | ForEach-Object {
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
$updatedLines | Set-Content $autoEnvPath -Encoding UTF8

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
    $deployType = Get-Content "$PSScriptRoot/../../../.env.local" |
    Where-Object { $_ -match '^VITE_DEPLOY_TARGET=' } |
    ForEach-Object {
        ($_ -split '=', 2)[1] -replace '"', '' -replace '\s*#.*$', '' -replace '\s+$', ''
    }
    $emulatorMode = Get-Content "$PSScriptRoot/../../../.env.local" |
    Where-Object { $_ -match '^SMARTRIDE_EMULATOR_MODE=' } |
    ForEach-Object {
        ($_ -split '=', 2)[1] -replace '"', '' -replace '\s*#.*$', '' -replace '\s+$', ''
    }
    Set-Location "frontend"
    $platformStr = if ($Platform -eq "--android") { "android" } else { "ios" }
    pnpm install
    pnpm --package="@capacitor/cli" dlx capacitor sync $platformStr
    Write-Host "Sync completed." -ForegroundColor Green
    if ($deployType -eq "MACHINE") {
        Write-Host -NoNewline "[SKIP] Target is MACHINE. Skipping 'npx cap run'."
        if ($Platform -eq "--android") {
            Write-Host "You can find the APK in the 'frontend/android/app/build/outputs/apk/debug' directory as 'app-debug.apk'." -ForegroundColor Cyan
        }
        else {
            Write-Host "You can find the IPA in the 'frontend/ios/build' directory." -ForegroundColor Cyan
        }
    }
    elseif ($emulatorMode -eq "NONE") {
        Write-Host "[SKIP] Emulator Mode is NONE. Skipping 'npx cap run'."
    }
    else {
        $emulModeStr = if ($emulatorMode -eq "RUN") { "run" } else { "open" }
        Start-Process powershell -ArgumentList @"
Write-Host "Press Enter to continue with '$emulModeStr $platformStr'..." -ForegroundColor Blue
Read-Host
pnpm --package="@capacitor/cli" dlx capacitor $emulModeStr $platformStr
Write-Host 'Press Enter to exit...'
Read-Host
"@
    }
}
else {
    Start-Process powershell -ArgumentList @"
cd frontend
pnpm install
pnpm preview
Write-Host 'Press Enter to exit...'
Read-Host
"@
}

Pop-Location
