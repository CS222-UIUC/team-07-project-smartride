#!/bin/bash
set -euo pipefail

pushd "$(dirname "$0")/../.." > /dev/null
echo "[Setup] Downloading team Google Drive files..."
"./drive.sh" --download
popd > /dev/null

exit 0