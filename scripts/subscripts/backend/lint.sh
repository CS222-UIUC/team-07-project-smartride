#!/bin/bash

if [[ "$SMARTRIDE_ENTRYPOINT" != "backend-main" ]]; then
  echo "Error: scripts/subscripts/backend/lint.sh must be run via scripts/check.sh with no parameter, or with --backend or --fullstack parameters."
  exit 1
fi

set -e

cd ../../../backend

echo -e "\n=== Running Ruff Fix ===\n"
ruff check server --fix --diff

echo -e "\n=== Running mypy ===\n"
mypy server

cd ../scripts/subscripts/backend