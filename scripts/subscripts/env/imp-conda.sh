#!/bin/bash

set -e

if [[ "$SMARTRIDE_ENTRYPOINT" != "sync-work" ]]; then
  echo "Error: scripts/subscripts/env/imp.ps1 must be run via scripts/sync-work.ps1 --(merge|pull)"
  exit 1
fi

echo "[Import Conda] Importing newest update on smartride-backend conda environment..."

if command -v conda &> /dev/null; then
  eval "$(conda shell.bash hook)"
else
  echo "Conda not found in PATH"
  exit 1
fi

cd "$(dirname "$0")/../../../backend"

conda activate base
conda-lock install --mamba --lockfile conda-lock.yml --name smartride-backend
if [[ $? -ne 0 ]]; then
  echo "Error: Failed to install/update conda environment. Aborting."
  cd - > /dev/null
  exit 1
fi
conda activate smartride-backend
cd - > /dev/null

HASH_FILE="$(dirname "$0")/parameters/last-import"
ORIGIN_HASH=$(git rev-parse origin/main)
echo "$ORIGIN_HASH" > "$HASH_FILE"

echo "[Import Conda] Conda is successfully imported."
