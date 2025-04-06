$archivePath = "../archive.log"
$outputPath = "../cherry.script"

# Default: empty output
"" | Set-Content $outputPath

if (-not (Test-Path $archivePath)) {
    return
}

# Read and trim lines
$lines = Get-Content $archivePath | Where-Object { $_.Trim() -ne "" }

# Check if no meaningful lines (only metadata or empty)
if ($lines.Count -eq 0 -or $lines[0] -match "^#") {
    return
}

# Extract the first non-blank commit= line
$firstCommitLine = $lines | Where-Object { $_ -match "^commit=" } | Select-Object -First 1
if (-not $firstCommitLine) {
    Write-Output "No commit found in archive."
    return
}

$archiveCommit = $firstCommitLine -replace "^commit=", ""
$headCommit = git rev-parse HEAD

if ($archiveCommit -eq $headCommit) {
    Write-Output "No new commits to cherry-pick."
    return
}

$cmd = "git cherry-pick $archiveCommit..HEAD"
$cmd | Set-Content $outputPath
Write-Output "Cherry-pick command written: $cmd"
