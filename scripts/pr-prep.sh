#!/bin/bash
set -e

cd "$(dirname "$0")"

bash "$(dirname "$0")/subscripts/setup/check-setup.sh"

echo
echo "[PrPrep] Preparing project before submitting PR..."
echo

echo
echo "[PrPrep] Running linters and static checks..."
echo
bash check.sh
if [ $? -ne 0 ]; then
    echo "[Error] Lint/check failed. Aborting."
    exit 1
fi

echo "[PrPrep] Running formatters..."
bash formatter.sh
if [ $? -ne 0 ]; then
    echo "[Error] Formatter failed. Aborting."
    exit 1
fi

echo "[PrPrep] Locking current conda environment..."
export SMARTRIDE_ENTRYPOINT="pr-prep"
pushd subscripts/env > /dev/null
bash lock-conda.sh
if [ $? -ne 0 ]; then
    echo "[Error] Failed to lock conda environment. Aborting."
    popd > /dev/null
    exit 1
fi
popd > /dev/null

echo "[PrPrep] Uploading team google drive files..."
bash drive.sh --upload
if [ $? -ne 0 ]; then
    echo "[Error] Failed to upload team google drive files. Aborting."
    exit 1
fi

echo "[PrPrep] PR preparation complete. You may now submit your pull request."
