#!/bin/bash
set -e

if [[ "$#" -ne 1 ]]; then
  echo "Usage: run.sh --full | --easy"
  exit 1
fi

MODE="$1"
if [[ "$MODE" != "--full" && "$MODE" != "--easy" ]]; then
  echo "Invalid mode: $MODE"
  echo "Usage: run.sh --full | --easy"
  exit 1
fi

cd "$(dirname "$0")"

if [[ "$MODE" == "--full" ]]; then
  echo "Running full setup (conda env update + run-easy)..."
  cd ../backend
  conda activate smartride-backend

  UNAME_OUT="$(uname -s)"
  if [[ "$UNAME_OUT" == MINGW* || "$UNAME_OUT" == MSYS* || "$UNAME_OUT" == CYGWIN* ]]; then
    echo "Using conda_env_win.yml"
    conda env update --file conda_env_win.yml --prune
  else
    echo "Using conda_env_mac.yml"
    conda env update --file conda_env_mac.yml --prune
  fi

  cd ../scripts
  echo "1" > subscripts/allow-easy
fi

echo "1" > subscripts/run-from-run
cd subscripts
bash run-easy.sh