#!/bin/bash
set -e

export _SMARTRIDE_DRIVE_WRAPPER=1
export SMARTRIDE_ENTRYPOINT=pull-main
cd "$(dirname "$0")"

echo "[pull-main] Switching to main branch..."
git checkout main || { echo -e "[Error] Failed to checkout main branch. Aborting."; exit 1; }
git pull || { echo -e "[Error] Failed to pull latest commits. Aborting."; exit 1; }

echo "[pull-main] Importing latest conda environment..."
bash scripts/subscripts/env/imp-conda.sh || { echo -e "[Error] Failed to sync local conda environment. Aborting."; exit 1; }

echo "[pull-main] Syncing team google drive files..."
bash scripts/drive.sh --download || { echo -e "[Error] Failed to sync team google drive files. Aborting."; exit 1; }

echo "[pull-main] All workflows completed! Happy coding!"