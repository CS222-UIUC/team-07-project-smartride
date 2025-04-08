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

echo "Using conda_env_mac.yml"
conda activate smartride-backend
mamba env update -n smartride-backend -f conda_env_mac.yml
if [[ $? -ne 0 ]]; then
  echo "Error: Mamba failed to update conda environment. Aborting."
  exit 1
fi

cd - > /dev/null

HASH_FILE="$(dirname "$0")/parameters/last-import"
ORIGIN_HASH=$(git rev-parse origin/main)
echo "$ORIGIN_HASH" > "$HASH_FILE"

echo "[Import Conda] Conda is successfully imported."
