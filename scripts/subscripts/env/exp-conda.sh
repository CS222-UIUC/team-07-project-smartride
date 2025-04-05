#!/bin/bash

set -e

if [[ "$SMARTRIDE_ENTRYPOINT" != "pr-prep" ]]; then
  echo "Error: scripts/subscripts/env/exp-conda.sh must be run via scripts/pr-prep.sh"
  exit 1
fi

# It is strictly prohibited to export before import, which is a behavior like git push before git pull

bash "$(dirname "$0")/check-conda-imp.sh"

# Export updated conda environment (Mac)

echo "[Export Conda] Preparing to export conda environment..."


if command -v conda &> /dev/null; then
  eval "$(conda shell.bash hook)"
else
  echo "Conda not found in PATH"
  exit 1
fi

cd ../../../backend

# Get the platform info
UNAME_OUT="$(uname -s)"

ENV_FILE="conda_env_mac.yml"
PY_FILE="conda_mac2win.py"

# Activate conda environment and export
if command -v conda >/dev/null 2>&1; then
    echo "[Export Conda] Exporting environment to $ENV_FILE"
    conda activate smartride-backend
    conda env export --no-builds | grep -v "^prefix:" | iconv -f utf-8 -t utf-8 > "$ENV_FILE"
    cd ../scripts/subscripts/env/python
    python "$PY_FILE"
else
    echo "[Export Conda] Error: Conda not available in current shell. Please activate it first or run conda init first."
    cd ../scripts/subscripts/env
    exit 1
fi

cd ..