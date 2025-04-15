param ()

Set-StrictMode -Version Latest

if ($env:SMARTRIDE_ENTRYPOINT -ne "conda-op") {
    Write-Host "Error: scripts/subscripts/env/inst-conda.ps1 must be run via scripts/conda-op.ps1 --install <pkg_name> [--pip]"
    exit 1
}

if ($args.Count -lt 2) {
    Write-Host "Usage: inst-conda.ps1 --package <pkg_name> [--pip]"
    exit 1
}

$PkgName = ""
$IsPip = $false

for ($i = 0; $i -lt $args.Count; $i++) {
    switch ($args[$i]) {
        "--package" {
            if ($i + 1 -lt $args.Count -and $args[$i + 1] -notmatch "^--") {
                $PkgName = $args[$i + 1]
                $i++
            } else {
                Write-Host "Error: --package must be followed by a valid package name."
                exit 1
            }
        }
        "--pip" {
            $IsPip = $true
        }
        default {
            Write-Host "Unknown option: $($args[$i])"
            exit 1
        }
    }
}

if ($PkgName -eq "") {
    Write-Host "Usage: inst-conda.ps1 --package <pkg_name> [--pip]"
    exit 1
}

if ($IsPip) {
    Write-Host "[Install Conda] Installing pip package: $PkgName"
    pip install --upgrade $PkgName
} else {
    Write-Host "[Install Conda] Installing conda package: $PkgName"
    mamba install -c conda-forge $PkgName
    python "python/conda_exporter.py" "../../../backend/conda-env.yml" $PkgName
}

Write-Host "[Install Conda] Done."
