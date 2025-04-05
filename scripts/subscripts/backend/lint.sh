#!/bin/bash

if [[ "$SMARTRIDE_ENTRYPOINT" != "backend-main" ]]; then
  echo "Error: scripts/subscripts/backend/lint.sh must be run via scripts/check.sh with no parameter, or with --backend or --fullstack parameters."
  exit 1
fi

cd ../../../backend

echo -e "\n=== Running Ruff Fix ===\n"
ruff check server --diff
ruff check server --fix
if [ $? -ne 0 ]; then
  echo "【Backend Lint] Ruff fix failed — aborting"
  cd ../scripts/subscripts/backend
  exit 1
fi

echo -e "\n=== Running mypy ===\n"
mypy server
if [ $? -ne 0 ]; then
  echo "【Backend Lint] Mypy checks failed — aborting"
  cd ../scripts/subscripts/backend
  exit 1
fi

cd ../scripts/subscripts/backend