#!/bin/bash

if [[ "$SMARTRIDE_ENTRYPOINT" != "frontend-main" ]]; then
  echo "Error: scripts/subscripts/frontend/lint.sh must be run via scripts/frontend.sh or scripts/auto.sh"
  exit 1
fi

set -e

cd "$(dirname "$0")/../../../frontend"
pnpm install
pnpm test
cd ../scripts/subscripts/frontend
