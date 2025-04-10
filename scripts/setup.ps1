param (
    [switch]$admin
)

Set-StrictMode -Version Latest

# usage: ./setup.ps1 -admin (NOTE: It is single dash)
if ($admin) {
    Write-Host "[Setup Admin] Danger! This mode is for updating setup.ps1 only. It will ask everyone to rerun this script."
    $continue = Read-Host "[Setup Admin] Do you want to continue? (Y/N)"
    if ($continue -ne 'Y') {
        Write-Host "[Setup Admin] Aborting."
        exit 0
    }
    $hashFile = "$PSScriptRoot/subscripts/env/parameters/latest-setup"
    $hash = Get-FileHash -Path $PSScriptRoot/setup.ps1 -Algorithm SHA256
    $hashValue = $hash.Hash
    Set-Content -Path $hashFile -Value $hashValue
    Write-Host "[Setup Admin] Hash of setup.ps1 has been written to 'latest-setup'."
    exit 0
}

Push-Location "$PSScriptRoot/../rclone"

# Step 1: Check rclone.conf
if (-not (Test-Path "rclone.conf")) {
    Copy-Item "rclone.conf.example" "rclone.conf"
}

$rcloneText = Get-Content "rclone.conf" -Raw
$pattern = 'token\s*=\s*(\{.*?\})'
$regex = [regex]::new($pattern, 'Singleline')
$match = $regex.Match($rcloneText)

if ($match.Success) {
    try {
        $tokenJson = $match.Groups[1].Value
        $tokenObj = $tokenJson | ConvertFrom-Json -ErrorAction Stop

        $requiredFields = @("access_token", "token_type", "refresh_token", "expiry")
        $missingFields = @()

        foreach ($field in $requiredFields) {
            if (-not $tokenObj.PSObject.Properties[$field] -or `
                    [string]::IsNullOrWhiteSpace($tokenObj.$field)) {
                $missingFields += $field
            }
        }

        if ($missingFields.Count -gt 0) {
            Write-Host "Error: rclone.conf is missing or has empty fields: $($missingFields -join ', '). Please complete it."
            Pop-Location
            exit 1
        }
        else {
            Write-Host "[Setup] rclone.conf is valid."
        }

    }
    catch {
        Write-Host "Error: Failed to parse token as JSON. Please ensure token = { ... } is valid JSON."
        Pop-Location
        exit 1
    }
}
else {
    Write-Host "Error: token section not found in rclone.conf."
    Pop-Location
    exit 1
}
Pop-Location

# Step 2: Check .env.local and .env.shared
Push-Location "$PSScriptRoot/.."
if (-not (Test-Path ".env.local")) {
    Copy-Item ".env.local.example" ".env.local"
}
else {
    # Check for missing entries in .env.local compared to .env.local.example
    $exampleLines = Get-Content ".env.local.example" | Where-Object { $_ -match "^\s*[^#=\s]+\s*=" }
    $localLines = Get-Content ".env.local" | Where-Object { $_ -match "^\s*[^#=\s]+\s*=" }

    $exampleKeys = @{}
    foreach ($line in $exampleLines) {
        if ($line -match "^\s*([^#=\s]+)\s*=\s*(.*)$") {
            $key = $matches[1].Trim()
            $val = $matches[2]
            $exampleKeys[$key] = $val
        }
    }

    $localKeys = $localLines | ForEach-Object {
        if ($_ -match "^\s*([^#=\s]+)\s*=") {
            $matches[1].Trim()
        }
    }

    $missingKeys = @($exampleKeys.Keys | Where-Object { $_ -notin $localKeys })

    if ($missingKeys.Count -gt 0) {
        "`n# --- Missing entries from .env.local.example added below ---" | Add-Content ".env.local"
        foreach ($k in $missingKeys) {
            "$k=$($exampleKeys[$k])" | Add-Content ".env.local"
        }
        Write-Host "[Setup] New entries were added to .env.local based on .env.local.example. Please check if any placeholder values (e.g., <...>) need to be filled in."
    }
    else {
        Write-Host "[Setup] All expected entries from .env.local.example are already present in .env.local."
    }
}

if (-not (Test-Path ".env.shared")) {
    Copy-Item ".env.shared.example" ".env.shared"
}

# A helper function to get the Git user name or exit if not set
function Get-GitUserOrExit {
    $gitUser = git config user.name 2>$null

    if (-not $gitUser -or $gitUser.Trim() -eq "") {
        Write-Host "Error: Git user.name is not set. Please configure it using:"
        Write-Host "       git config --global user.name \"Your Name\""
        if (Get-Location -match "scripts") {
            Pop-Location
        }
        exit 1
    }

    return $gitUser.Trim()
}

$committerLine = Get-Content ".env.local" | Where-Object { $_ -match "^COMMITTER\s*=\s*(.*)$" }

if ($committerLine -and $committerLine -match "^COMMITTER\s*=\s*(.*)$") {
    $committerValue = $matches[1].Trim()
    $shouldReplace = (
        $committerValue -eq "" -or
        $committerValue -match '^["'']{1}\s*["'']{1}$' -or # " " or ' '
        $committerValue -match '^<.*?>$' -or
        $committerValue -match '^["'']?<.*?>["'']?$' -or
        $committerValue -match '^\s*$' -or
        $committerValue -match '^#'
    )
    if ($shouldReplace) {
        $gitUser = Get-GitUserOrExit
        Write-Host "Git user.name is set to: $gitUser"
        $envPath = ".env.local"
        $content = Get-Content $envPath
        if ($content -match "^COMMITTER\s*=") {
            $replacement = "COMMITTER=`"$gitUser`""
            $newContent = $content -replace '(?i)^COMMITTER\s*=.*$', $replacement
        }
        else {
            $newContent = $content + 'COMMITTER="' + $gitUser + '"'
        }
        Set-Content -Path $envPath -Value $newContent
        Write-Host "[Setup] COMMITTER is now set to '$gitUser' in .env.local. Change it manually if user.name is not your GitHub username."
    }
    else {
        Write-Host "[Setup] .env.local is valid."
    }
}
else {
    $gitUser = Get-GitUserOrExit
    Write-Host "Git user.name is set to: $gitUser"
    $envPath = ".env.local"
    $content = Get-Content $envPath

    $committerLineMatch = $content | Select-String '^# Committer$'
    $committerLineIndex = if ($committerLineMatch) { $committerLineMatch.LineNumber - 1 } else { -1 }

    if ($committerLineIndex -ge 0) {
        $newContent = $content[0..$committerLineIndex] + "COMMITTER=`"$gitUser`"" + $content[($committerLineIndex + 1)..($content.Length - 1)]
    }
    else {
        $newContent = @(
            "# Committer"
            "COMMITTER=`"$gitUser`""
        ) + $content
    }

    Set-Content -Path $envPath -Value $newContent
    Write-Host "[Setup] COMMITTER is now inserted as '$gitUser' in .env.local. Change it manually if user.name is not your GitHub username."
    Pop-Location
    exit 0
}
Pop-Location

# Step 3: Check for required CLIs
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
    $choice = Read-Host "[Setup] Do you want to install them to the 'libraries' folder? (Y/N)"
    if ($choice -ne 'Y') {
        Write-Host "[Setup] Please install and configure them manually, then rerun this script. Aborting."
        exit 1
    }

    # Step 4: Install rclone
    Push-Location "$PSScriptRoot/../libraries"
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
    Push-Location "$PSScriptRoot/../libraries"
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
    # TODO [Brian]: Test the behavior of line 173-183
    Push-Location "$PSScriptRoot/../libraries"
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

# Step 8: Check ngrok
if (-not (Get-Command ngrok -ErrorAction SilentlyContinue)) {
    Write-Warning "[Warning] ngrok not found. Please sign up at ngrok.com, choose the free plan, and install manually."
}

# Step 9: Require restart if any download happened
if ($downloadCnt -gt 0) {
    Write-Host "[Setup] Except for pnpm, all components installed by this script are registered in the User Environment Path. If you decide to move 'libraries' folder or the whole project folder, you are required to update the User Environment Path manually."
    Write-Host "[Setup] $(missingTools -join ', ') are installed. Please restart your terminal and rerun this script to enable the changes."
    exit 0
}

Write-Host "[Setup] All manadatory tools are installed."

# Step 10: Setup conda environment
conda activate base
conda install -n base -c conda-forge mamba conda-lock -y
Push-Location "$PSScriptRoot/subscripts/env"
& "./check-setup.ps1" *> $null
if ($LASTEXITCODE -ne 0) {
    # The first time setting up (after installing pnpm, conda, rclone), user might be using the legacy conda environment
    # Check if 'smartride-backend' environment exists, if yes, uninstall
    $envExists = conda env list | Select-String "^\s*smartride-backend\s"
    if ($envExists) {
        Write-Host "[Setup] First time setting up (since version changed). Reinstalling smartride-backend conda environment..."
        Write-Host "[Setup] Uninstalling smartride-backend conda environment..."
        conda env remove -n smartride-backend -y
    }
    conda clean --all -y
}

Push-Location "$PSScriptRoot/../backend"
Write-Host "[Setup] Installing or updating smartride-backend conda environment..."
conda-lock install --mamba conda-lock.yml --name smartride-backend
conda activate smartride-backend
Write-Host "[Setup] smartride-backend conda environment is successfully installed and activated."
Pop-Location

# Step 11: Sync Google Drive files
Push-Location "$PSScriptRoot"
Write-Host "[Setup] Downloading team Google Drive files..."
& "./drive.ps1" --download
Pop-Location

# Step 12: Completed, output the hash of this file ($PSScriptRoot/setup.ps1) to last-setup in subscripts/env/parameters/last-setup (may be not existed yet)
$hashFile = "$PSScriptRoot/subscripts/env/parameters/last-setup"
$hash = Get-FileHash -Path $PSScriptRoot/setup.ps1 -Algorithm SHA256
$hashValue = $hash.Hash
Set-Content -Path $hashFile -Value $hashValue

Write-Host "[Setup] SmartRide setup complete. Please check the 'docs' folder for documentation."
Write-Host "[Setup] To run the project, first run './sync-work.ps1 --pull' and then './run.ps1'. Happy coding!"