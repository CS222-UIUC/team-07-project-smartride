#!/bin/bash

if [[ "$SMARTRIDE_ENTRYPOINT" != "backend-main" ]]; then
  echo "Error: scripts/subscripts/backend/test.sh must be run via scripts/backend.sh or scripts/backend.sh"
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