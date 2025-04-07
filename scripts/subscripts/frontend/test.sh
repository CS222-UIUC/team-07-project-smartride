#!/bin/bash

if [[ "$SMARTRIDE_ENTRYPOINT" != "frontend-main" ]]; then
  echo "Error: scripts/subscripts/frontend/test.sh must be run via scripts/check.sh with no parameter, or with --frontend or --fullstack parameters."
  exit 1
fi

set -e

cd "$(dirname "$0")/../../../frontend"
pnpm install > /dev/null
pnpm test
cd ../scripts/subscripts/frontend
