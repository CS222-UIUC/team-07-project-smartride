#!/bin/bash
set -e

FLAG_FILE="$(dirname "$0")/parameters/conda-imported"
if [[ ! -f "$FLAG_FILE" || "$(cat "$FLAG_FILE")" != "1" ]]; then
  echo "Error: Local conda environment not updated. You should first execute sync-work.sh with --merge or --pull option."
  echo "0" > "$FLAG_FILE"
  exit 1
fi

echo "Local conda environment is synced."
exit 0