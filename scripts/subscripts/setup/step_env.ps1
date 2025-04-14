Push-Location "$PSScriptRoot/../../.."
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

if (-not (Test-Path ".env.auto")) {
    Copy-Item ".env.auto.example" ".env.auto"
}
else {
    # Check for missing entries in .env.auto compared to .env.auto.example
    $exampleLines = Get-Content ".env.auto.example" | Where-Object { $_ -match "^\s*[^#=\s]+\s*=" }
    $autoLines = Get-Content ".env.auto" | Where-Object { $_ -match "^\s*[^#=\s]+\s*=" }

    $exampleKeys = @{}
    foreach ($line in $autoLines) {
        if ($line -match "^\s*([^#=\s]+)\s*=\s*(.*)$") {
            $key = $matches[1].Trim()
            $val = $matches[2]
            $exampleKeys[$key] = $val
        }
    }

    $autoKeys = $autoLines | ForEach-Object {
        if ($_ -match "^\s*([^#=\s]+)\s*=") {
            $matches[1].Trim()
        }
    }

    $missingKeys = @($exampleKeys.Keys | Where-Object { $_ -notin $autoKeys })

    if ($missingKeys.Count -gt 0) {
        "`n# --- Missing entries from .env.auto.example added below ---" | Add-Content ".env.auto"
        foreach ($k in $missingKeys) {
            "$k=$($exampleKeys[$k])" | Add-Content ".env.auto"
        }
        Write-Host "[Setup] New entries were added to .env.auto based on .env.auto.example. You should NOT modify any value in there by hand."
    }
    else {
        Write-Host "[Setup] All expected entries from .env.auto.example are already present in .env.auto."
    }
}

if (-not (Test-Path ".env.shared")) {
    Copy-Item ".env.shared.example" ".env.shared"
}

# A helper function to get the Git user name or exit if not set
function Get-GitUserOrExit {
    $gitUser = git config user.name 2>$null

    if (-not $gitUser -or $gitUser.Trim() -eq "") {
        Write-Host "Error: Git user.name is not set. Please configure it using:" -ForegroundColor Red
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
}
Pop-Location
exit 0