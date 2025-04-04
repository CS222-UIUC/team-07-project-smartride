Set-StrictMode -Version Latest

$allowFile = "$PSScriptRoot\parameters\conda-imported"
if (!(Test-Path $allowFile) -or (Get-Content $allowFile).Trim() -ne "1") {
    Write-Host "Error: Local conda environment not updated. You should first execute sync-work.ps1 with --merge or --pull option."
    Set-Content -Path $allowFile -Value "0"
    exit 1
}

Write-Host "Local conda environment is synced."
exit 0