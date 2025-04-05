param (
    [Parameter(Mandatory = $true)]
    [ValidateSet("--upload", "--download")]
    [string]$Mode
)

Set-StrictMode -Version Latest

$env:_SMARTRIDE_DRIVE_WRAPPER = "1"
Push-Location "$PSScriptRoot/../"

conda activate smartride-backend

if ($Mode -eq "--download") {
    Write-Host "[download] Validating control file formats..."
    python scripts/subscripts/drive/python/validate.py --format
    if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }

    Write-Host "[download] Downloading secret files from SmartRide team Google Drive..."
    python scripts/subscripts/drive/python/download.py
    if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }

    Write-Host "[download] Validating sync status..."
    python scripts/subscripts/drive/python/validate.py --sync
    if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }

    Write-Host "[download] Job finished. Local files tracked by drive-file.txt are all synced with google drive."
}
elseif ($Mode -eq "--upload") {
    Write-Host "[upload] Validating local file structure..."
    python scripts/subscripts/drive/python/validate.py --local
    if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }

    Write-Host "[upload] Hashing owned files..."
    python scripts/subscripts/drive/python/hashfill.py
    if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }

    Write-Host "[upload] Uploading files to SmartRide team Google Drive..."
    python scripts/subscripts/drive/python/upload.py
    if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }

    Write-Host "[upload] Validating sync status..."
    python scripts/subscripts/drive/python/validate.py --sync
    if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }

    Write-Host "[upload] Job finished. Local files tracked by drive-file.txt are all synced with google drive."
}

Pop-Location
