#!/bin/bash
set -e

if [ "$1" != "--pull" ] && [ "$1" != "--merge" ]; then
    echo -e "[Error] Usage: ./sync-main.sh --pull | --merge"
    exit 1
fi

cd "$(dirname "$0")"

echo
echo "[SyncMain] Starting sync mode: $1"
echo

if [ "$1" = "--pull" ]; then
    echo "[Git] Checking out and pulling origin/main..."
    git checkout main || { echo -e "[Error] Checkout failed."; exit 1; }
    git pull || { echo -e "[Error] Pull failed."; exit 1; }
elif [ "$1" = "--merge" ]; then
    echo "[Git] Fetching and merging origin/main into current branch..."
    git fetch origin || { echo -e "[Error] Fetch failed."; exit 1; }
    git merge origin/main || { echo -e "[Error] Merge failed. Resolve manually."; exit 1; }
fi

echo "[SyncMain] Importing latest conda environment..."
export SMARTRIDE_ENTRYPOINT="sync-main"
bash scripts/subscripts/env/imp-conda.sh || { echo -e "[Error] Failed to sync local conda environment. Aborting."; exit 1; }

echo "[SyncMain] Syncing team google drive files..."
bash scripts/drive.sh --download || { echo -e "[Error] Failed to sync team google drive files. Aborting."; exit 1; }

echo "[SyncMain] All workflows completed! Happy coding!"