# Array of legacy files to clean
$legacyFiles = @(
    "$PSScriptRoot/env/parameters/processing_conda",
    "$PSScriptRoot/env/parameters/latest-setup"
)

# Iterate through each file and attempt to clean
foreach ($file in $legacyFiles) {
    if (Test-Path $file) {
        try {
            Remove-Item -Path $file -Force -ErrorAction Stop
            Write-Host "Successfully cleaned: $file"
        }
        catch {
            Write-Host "Failed to clean: $file. Error: $_"
        }
    }
    else {
        Write-Host "File already cleaned or does not exist: $file"
    }
}