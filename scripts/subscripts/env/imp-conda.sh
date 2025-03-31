#!/bin/bash

set -e

if [[ "$SMARTRIDE_ENTRYPOINT" != "sync-work" ]]; then
  echo "Error: scripts/subscripts/env/imp.ps1 must be run via scripts/sync-work.ps1 --(merge|pull)"
  exit 1
fi

echo "[Import Conda] Importing newest update on smartride-backend conda environment..."

cd "$(dirname "$0")/../../../backend"

echo "Using conda_env_mac.yml"
conda activate smartride-backend
conda env update --file conda_env_mac.yml > /dev/null

cd - > /dev/null

echo "1" > "$(dirname "$0")/../env/parameters/conda-imported"
echo "[Import Conda] Environment imported. Flag set to 1."

echo "[Import Conda] Conda import completed."
