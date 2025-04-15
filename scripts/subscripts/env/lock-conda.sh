#!/bin/bash

set -euo pipefail

if [[ "$SMARTRIDE_ENTRYPOINT" != "pr-prep" && "$SMARTRIDE_ENTRYPOINT" != "conda-op" ]]; then
  echo "Error: scripts/subscripts/env/lock-conda.sh must be run via scripts/pr-prep.sh or scripts/conda-op.sh --lock"
  exit 1
fi

# It is strictly prohibited to lock before import, which is a behavior like git push before git pull

bash "$(dirname "$0")/check-conda-imp.sh"

# Lock updated conda environment

echo "[Lock Conda] Preparing to lock conda environment..."

if command -v conda &> /dev/null; then
  eval "$(conda shell.bash hook)"
else
  echo "Conda not found in PATH"
  exit 1
fi

pushd python > /dev/null
CONDA_ENV_REL_PATH="../../../../backend/conda-env.yml"
CONDA_LOCK_REL_PATH="../../../../backend/conda-lock.yml"
conda activate smartride-backend
echo "[Lock Conda] Post-processing yaml file..."
python conda_channel_cleaner.py "$CONDA_ENV_REL_PATH"
python conda_pips_filler.py "$CONDA_ENV_REL_PATH"
python conda_yml_formatter.py "$CONDA_ENV_REL_PATH"
echo "[Lock Conda] Locking conda environment..."
conda-lock lock --mamba \
  --file "$CONDA_ENV_REL_PATH" \
  --platform win-64 \
  --platform linux-64 \
  --platform osx-64 \
  --lockfile "$CONDA_LOCK_REL_PATH" 1>/dev/null
popd > /dev/null

echo "[Lock Conda] The conda environment is successfully locked."