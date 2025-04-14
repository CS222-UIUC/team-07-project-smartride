Push-Location "$PSScriptRoot/../../../rclone"
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
            Write-Host "Error: rclone.conf is missing or has empty fields: $($missingFields -join ', '). Please complete it." -ForegroundColor Red
            Pop-Location
            exit 1
        }
        else {
            Write-Host "[Setup] rclone.conf is valid."
        }

    }
    catch {
        Write-Host "Error: Failed to parse 'token' entry in rclone.conf as JSON. Please ensure 'token = { ... }' is valid JSON." -ForegroundColor Red
        Pop-Location
        exit 1
    }
}
else {
    Write-Host "Error: token section not found in rclone.conf." -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

exit 0