#!/bin/bash

set -e

if [[ "$SMARTRIDE_ENTRYPOINT" != "pull-main" ]]; then
  echo "Error: scripts/subscripts/env/imp-conda.sh must be run via scripts/pull-main.sh"
  exit 1
fi

echo "Importing newest update on smartride-backend conda environment..."

cd "$(dirname "$0")/../../../backend"

echo "Using conda_env_mac.yml"
conda activate smartride-backend
conda env update --file conda_env_mac.yml

cd - > /dev/null

echo "1" > "$(dirname "$0")/../env/parameters/conda-synced"
echo "[Sync Conda] Environment synced. Flag set to 1."

echo "Conda import completed."
