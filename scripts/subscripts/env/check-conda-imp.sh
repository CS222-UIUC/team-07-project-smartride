#!/bin/bash
set -e

HASH_FILE="$(dirname "$0")/parameters/last-import"

git fetch origin >/dev/null 2>&1
ORIGIN_HASH=$(git rev-parse origin/main)

if [[ ! -f "$HASH_FILE" ]]; then
  echo "[check-conda-imported] Creating local hash record for first-time setup: $ORIGIN_HASH"
  echo "$ORIGIN_HASH" > "$HASH_FILE"
fi

STORED_HASH=$(cat "$HASH_FILE" | tr -d '\r\n')

if [[ "$STORED_HASH" != "$ORIGIN_HASH" ]]; then
  echo "Error: Conda environment outdated. Please run scripts/sync-work.ps1 --pull | --merge to update."
  exit 1
fi

echo "Local conda environment is up to date."
exit 0
