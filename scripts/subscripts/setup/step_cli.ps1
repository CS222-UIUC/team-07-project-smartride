$downloadCnt = 0
$requiredTools = @{ "rclone" = "rclone.exe"; "pnpm" = "pnpm.cmd"; "node" = "node.exe"; "conda" = "conda.exe" }
$missingTools = @()
foreach ($tool in $requiredTools.Keys) {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
        $missingTools += $tool
    }
}
if ($missingTools.Count -gt 0) {
    Write-Host "[Setup] The following tools are missing: $($missingTools -join ", ")"
    $choice = Read-Host "[Setup] Do you want to install them to the 'libraries' folder? (Y/N)" -ForegroundColor Yellow
    if ($choice -ne 'Y') {
        Write-Host "[Setup] Please install and configure them manually, then rerun this script. Aborting."
        exit 1
    }

    # Step 4: Install rclone
    Push-Location "$PSScriptRoot/../../../libraries"
    if ($missingTools -contains "rclone") {
        Write-Host "[Setup] Installing rclone..."
        $zip = "rclone.zip"
        Invoke-WebRequest https://downloads.rclone.org/v1.69.1/rclone-v1.69.1-windows-amd64.zip -OutFile $zip
        Expand-Archive $zip -DestinationPath .
        Remove-Item $zip
        Copy-Item "rclone-v1.69.1-windows-amd64\rclone.exe" "rclone.exe"
        Remove-Item "rclone-v1.69.1-windows-amd64" -Recurse -Force
        $userEnv = [System.Environment]::GetEnvironmentVariable("Path", "User")
        if ($userEnv -notlike "*$(Get-Location)*") {
            Write-Host "[Setup] Adding $(Get-Location) to User Environment Path."
            [System.Environment]::SetEnvironmentVariable("Path", "$userEnv;$(Get-Location)", "User")
        }
        Write-Host "[Setup] rclone CLI is successfully installed."
        $downloadCnt++
    }
    else {
        Write-Host "[Setup] rclone CLI is already installed."
    }
    Pop-Location

    # Step 5: Install pnpm
    if ($missingTools -contains "pnpm") {
        Write-Host "[Setup] Installing pnpm..."
        Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
        Write-Host "[Setup] pnpm CLI is successfully installed."
        $downloadCnt++
    }
    else {
        Write-Host "[Setup] pnpm CLI is already installed."
    }

    # Step 6: Install Node.js
    Push-Location "$PSScriptRoot/../../../libraries"
    if ($missingTools -contains "node") {
        Write-Host "[Setup] Installing Node.js..."
        $zip = "node.zip"
        Invoke-WebRequest https://nodejs.org/dist/v22.14.0/node-v22.14.0-win-x64.zip -OutFile $zip
        Expand-Archive $zip -DestinationPath .
        Remove-Item $zip
        $nodePath = Join-Path (Get-Location) "node-v22.14.0-win-x64"
        $userEnv = [System.Environment]::GetEnvironmentVariable("Path", "User")
        if ($userEnv -notlike "*$nodePath*") {
            [System.Environment]::SetEnvironmentVariable("Path", "$userEnv;$nodePath", "User")
        }
        Write-Host "[Setup] Node.js is successfully installed."
        $downloadCnt++
    }
    else {
        Write-Host "[Setup] Node.js is already installed."
    }
    Pop-Location

    # Step 7: Install Miniconda to libraries/miniconda3 if not installed
    Push-Location "$PSScriptRoot/../../../libraries"
    if ($missingTools -contains "conda") {
        Write-Host "[Setup] Installing Miniconda..."
        Invoke-WebRequest "https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe" -OutFile ".\miniconda.exe"
        Start-Process -FilePath ".\miniconda.exe" -ArgumentList "/S", "/D=$(Join-Path (Get-Location) 'miniconda3')" -Wait
        Remove-Item ".\miniconda.exe"
        Write-Host "[Setup] Miniconda successfully installed to libraries/miniconda3."
        $downloadCnt++
    }
    else {
        Write-Host "[Setup] Miniconda is already installed."
    }
    Pop-Location
}

# Step 8: Require restart if any download happened
if ($downloadCnt -gt 0) {
    Write-Host "[Setup] Except for pnpm, all components installed by this script are registered in the User Environment Path. If you decide to move 'libraries' folder or the whole project folder, you are required to update the User Environment Path manually."
    Write-Host "[Setup] $($missingTools -join ', ') are installed. Please restart your terminal and rerun this script to enable the changes."
    exit 1
}

Write-Host "[Setup] All manadatory tools are installed."
exit 0