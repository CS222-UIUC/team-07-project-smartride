param (
    [Parameter(Mandatory = $true)][string]$step,
    [Parameter(Mandatory = $true)][string]$version
)

Set-StrictMode -Version Latest

$versionFile = "$PSScriptRoot/parameters/lastVersion"
$newLines = New-Object System.Collections.Generic.List[string]

if (Test-Path $versionFile) {
    Get-Content $versionFile | Where-Object { $_ -notmatch "^\s*$step\s*=" } | ForEach-Object {
        $newLines.Add($_)
    }
}

$newLines.Add("$step=$version")
$newLines | Out-File -FilePath $versionFile -Encoding utf8 -Force
