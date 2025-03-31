#!/bin/bash
set -e

if [ "$1" != "--pull" ] && [ "$1" != "--merge" ]; then
    echo "[Error] Usage: ./sync-main.sh --pull | --merge"
    exit 1
fi

cd "$(dirname "$0")"

echo
echo "[SyncMain] Starting sync mode: $1"
echo

if [ "$1" = "--pull" ]; then
    echo "[Git] Checking out and pulling origin/main..."
    git checkout main || { echo "[Error] Failed to checkout main. Aborting."; exit 1; }
    git pull || { echo "[Error] Failed to pull from origin/main. Aborting."; exit 1; }
elif [ "$1" = "--merge" ]; then
    echo "[Git] Fetching and merging origin/main into current branch..."
    git fetch origin || { echo "[Error] Failed to fetch. Aborting."; exit 1; }
    git merge origin/main || { echo "[Error] Merge failed. Please resolve conflicts manually then rerun."; exit 1; }
fi

echo "[SyncMain] Importing latest conda environment..."
export SMARTRIDE_ENTRYPOINT="sync-main"
pushd subscripts/env > /dev/null
bash imp-conda.sh || { echo "[Error] Failed to sync local conda environment. Aborting."; popd > /dev/null; exit 1; }
popd > /dev/null

echo "[SyncMain] Downloading team google drive files..."
bash drive.sh --download || { echo "[Error] Failed to download team google drive files. Aborting."; exit 1; }

echo "[SyncMain] All workflows completed! Happy coding!"
