#!/bin/bash

if [[ "$SMARTRIDE_ENTRYPOINT" != "frontend-main" ]]; then
  echo "Error: scripts/subscripts/frontend/test.sh must be run via scripts/check.sh with no parameter, or with --frontend or --fullstack parameters."
  exit 1
fi

set -e

cd "$(dirname "$0")/../../../frontend"
pnpm install > /dev/null
pnpm test --coverage

platform=$(uname)
if [[ "$platform" != "Darwin" && "$platform" != "Linux" ]]; then
  echo "[Frontend Test] Unsupported platform: $platform"
  exit 1
fi

if [[ "$platform" == "Linux" ]]; then
  echo "[Frontend Test] Coverage report generated. You may open <project_dir>/frontend/coverage/index.html manually."
else
  open coverage/index.html
fi
cd ../scripts/subscripts/frontend
