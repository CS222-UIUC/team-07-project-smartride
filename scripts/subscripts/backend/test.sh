#!/bin/bash

if [[ "$SMARTRIDE_ENTRYPOINT" != "backend-main" ]]; then
  echo "Error: scripts/subscripts/backend/test.sh must be run via scripts/check.sh with no parameter, or with --backend or --fullstack parameters."
  exit 1
fi

set -e

# Move to backend directory
cd ../../../backend
conda activate smartride-backend

# Run pytest with coverage
coverage run -m pytest --cov=server tests/
coverage report

cd ../scripts/subscripts/backend