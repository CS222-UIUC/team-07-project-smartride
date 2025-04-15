Set-StrictMode -Version Latest

$env:SMARTRIDE_ENTRYPOINT = "conda-op"

if ($args.Count -eq 0) {
    Write-Host "Usage: conda-op.ps1 [--install <pkg_name> [--pip]] | [--lock] | [--import]"
    exit 1
}

$cmd = $args[0]

Push-Location "$PSScriptRoot/subscripts/env"
switch ($cmd) {
    "--install" {
        if ($args.Count -lt 2) {
            Write-Host "Error: Missing package name for --install."
            Write-Host "Usage: conda-op.ps1 [--install <pkg_name> [--pip]] | [--lock] | [--import]"
            exit 1
        }
        $installArgs = $args[1..($args.Count - 1)]
        & "inst-conda.ps1" --package @installArgs
    }
    "--lock" {
        & "lock-conda.ps1"
    }
    "--import" {
        & "imp-conda.ps1"
    }
    default {
        Write-Host "Usage: conda-op.ps1 [--install <pkg_name> [--pip]] | [--lock] | [--import]"
        exit 1
    }
}

Pop-Location