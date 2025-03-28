#!/bin/bash

echo "[Backend] Preparing to export conda environment..."

cd ../backend

# Get the platform info
UNAME_OUT="$(uname -s)"

# Distinguish platform name and set ENV_FILE
if [[ "$UNAME_OUT" == "Linux" || "$UNAME_OUT" == "Darwin" ]]; then
    ENV_FILE="conda_env_mac.yml"
    PY_FILE="conda_mac2win.py"
    echo "[Backend] Detected Unix-like system: $UNAME_OUT"
elif [[ "$UNAME_OUT" == MINGW* || "$UNAME_OUT" == MSYS* || "$UNAME_OUT" == CYGWIN* ]]; then
    ENV_FILE="conda_env_win.yml"
    PY_FILE="conda_win2mac.py"
    echo "[Backend] Detected Windows-like system: $UNAME_OUT"
else
    echo "[Backend] Unknown system: $UNAME_OUT"
    cd ../scripts
    exit 1
fi

# Activate conda environment and export
if command -v conda >/dev/null 2>&1; then
    echo "[Backend] Exporting environment to $ENV_FILE"
    conda activate smartride-backend
    conda env export --no-builds | grep -v "^prefix:" > "$ENV_FILE"
    cd ../scripts/python
    python "$PY_FILE"
else
    echo "[Backend] Conda not available in current shell. Skipping export."
fi

cd ..