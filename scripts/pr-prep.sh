#!/bin/bash
set -e

cd "$(dirname "$0")"

echo
echo "[PrPrep] Preparing project before submitting PR..."
echo

echo "[PrPrep] Running linters and static checks..."
bash check.sh || { echo "[Error] Lint/check failed. Aborting."; exit 1; }

echo "[PrPrep] Running formatters..."
bash format.sh || { echo "[Error] Formatter failed. Aborting."; exit 1; }

echo "[PrPrep] Exporting current conda environment..."
export SMARTRIDE_ENTRYPOINT="pr-prep"
bash subscripts/env/exp-conda.sh || { echo "[Error] Failed to export conda environment. Aborting."; exit 1; }

echo "[PrPrep] Uploading team google drive files..."
bash drive.sh --upload || { echo "[Error] Failed to upload team google drive files. Aborting."; exit 1; }

echo "[PrPrep] PR preparation complete. You may now submit your pull request."
