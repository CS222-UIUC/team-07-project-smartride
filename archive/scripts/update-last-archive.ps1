$commit = git rev-parse HEAD
$commitMsgRaw = git log -1 --pretty=%B
$commitMsg = $commitMsgRaw -replace "`r?`n", "\\n"
$timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
$archivePath = "../archive.log"

$newRecord = @(
    "commit=$commit",
    "timestamp=$timestamp",
    "message=$commitMsg",
    ""
)

$defaultMetadata = @(
    "# metadata",
    "archive_branch=archive/pre-rebase-main-latest",
    "main_branch=main"
)

$needWrite = $true
$metaCleaned = $false

if (-not (Test-Path $archivePath)) {
    ($newRecord + $defaultMetadata) | Set-Content $archivePath
    Write-Output "Archive created."
    return
}

# === STEP 1: Clean up trailing blank lines
$lines = Get-Content $archivePath | Where-Object { $_ -ne $null }
while ($lines.Count -gt 0 -and $lines[-1].Trim() -eq "") {
    $lines = $lines[0..($lines.Count - 2)]
}

# === STEP 2: Clean up record spacing (remove blank lines within records)
$cleanedLines = @()
$i = 0
while ($i -lt $lines.Count) {
    if ($lines[$i] -match "^commit=") {
        $cleanedLines += $lines[$i]
        if ($i + 1 -lt $lines.Count -and $lines[$i + 1] -match "^timestamp=") {
            $cleanedLines += $lines[$i + 1]
        }
        if ($i + 2 -lt $lines.Count -and $lines[$i + 2] -match "^message=") {
            $cleanedLines += $lines[$i + 2]
        }
        $cleanedLines += ""  # exactly one blank line after each message
        $i += 3
        while ($i -lt $lines.Count -and $lines[$i].Trim() -eq "") { $i++ }  # skip internal blanks
    } else {
        $cleanedLines += $lines[$i]
        $i++
    }
}

$lines = $cleanedLines

# === STEP 3: Clean metadata if broken
$metaStart = ($lines | Select-String "^# metadata" | Select-Object -First 1).LineNumber
if ($metaStart) {
    $metaIndex = $metaStart - 1
    $beforeMeta = $lines[0..($metaIndex - 1)]
    $afterMeta = $lines[$metaIndex..($lines.Count - 1)]
    $cleanMeta = $afterMeta | Where-Object {
        $_ -match "^# metadata" -or
        $_ -match "^archive_branch=" -or
        $_ -match "^main_branch="
    }
    if ($cleanMeta.Count -ne 3) {
        $metaCleaned = $true
        $lines = $beforeMeta
    }
} else {
    $metaCleaned = $true
}

# === STEP 4: Check for existing record
for ($i = 0; $i -le $lines.Count - 4; $i += 4) {
    $c = $lines[$i]
    $m = $lines[$i + 2]
    if ($c -eq "commit=$commit" -and $m -eq "message=$commitMsg") {
        Write-Output "Entry already exists. Skipping."
        $needWrite = $false
        break
    }
}

# === STEP 5: Write updated result
if ($needWrite) {
    $output = @()
    $output += $newRecord
    $output += $lines
    if ($metaCleaned) {
        if ($output[-1].Trim() -ne "") {
            $output += ""  # ensure one blank line before metadata
        }
        $output += $defaultMetadata
    }
    # Final cleanup: ensure exactly one blank line before metadata
    while ($output.Count -ge 2 -and $output[-2].Trim() -eq "" -and $output[-1] -match "^# metadata") {
        $output = $output[0..($output.Count - 3)] + $output[-1]
    }
    $output | Set-Content $archivePath
    Write-Output "New archive entry added."
}
