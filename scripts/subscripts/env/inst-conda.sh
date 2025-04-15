#!/bin/bash
set -e

if [[ "$SMARTRIDE_ENTRYPOINT" != "conda-op" ]]; then
  echo "Error: scripts/subscripts/env/inst-conda.sh must be run via scripts/conda-op.sh --install <pkg_name> [--pip]"
  exit 1
fi

PKG_NAME=""
IS_PIP=0

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --package)
      shift
      if [[ -z "$1" || "$1" == --* ]]; then
        echo "Error: --package requires a valid package name"
        exit 1
      fi
      PKG_NAME="$1"
      ;;
    --pip)
      IS_PIP=1
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
  shift
done

if [[ -z "$PKG_NAME" ]]; then
  echo "Usage: inst-conda.sh --package <pkg_name> [--pip]"
  exit 1
fi

if [[ $IS_PIP -eq 1 ]]; then
  echo "[Install Conda] Installing pip package: $PKG_NAME"
  pip install --upgrade "$PKG_NAME"
else
  echo "[Install Conda] Installing conda package: $PKG_NAME"
  mamba install -c conda-forge "$PKG_NAME"
  python "python/conda_exporter.py" "../../../backend/conda-env.yml" "$PKG_NAME"
fi

echo "[Install Conda] Done."
