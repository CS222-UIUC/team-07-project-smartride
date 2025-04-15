#!/bin/bash

if [[ "$SMARTRIDE_ENTRYPOINT" != "backend-main" ]]; then
  echo "Error: scripts/subscripts/backend/test.sh must be run via scripts/check.sh with no parameter, or with --backend or --fullstack parameters."
  exit 1
fi

# Move to backend directory
cd ../../../backend

if command -v conda &> /dev/null; then
  eval "$(conda shell.bash hook)"
else
  echo "Conda not found in PATH"
  exit 1
fi

conda activate smartride-backend

# Run pytest with coverage
pytest --cov=server --cov-report=term --cov-report=html --rich tests/

platform=$(uname)
if [[ "$platform" != "Darwin" && "$platform" != "Linux" ]]; then
  echo "[Backend Test] Unsupported platform: $platform"
  exit 1
fi

if [[ "$platform" == "Linux" ]]; then
  echo "[Frontend Test] Coverage report generated. You may open <project_dir>/backend/htmlcov/index.html manually."
else
  open htmlcov/index.html
fi

cd ../scripts/subscripts/backend