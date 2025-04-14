#!/bin/bash
set -euo pipefail

if ! command -v conda &> /dev/null; then
  echo "[Setup] Conda not found in PATH. Please make sure to run:"
  echo "       source ~/miniconda3/bin/activate"
  echo "       conda init --all"
  exit 1
fi

# Step 11: Setup conda environment
if command -v conda &> /dev/null; then
  eval "$(conda shell.bash hook)"
else
  echo "Conda not found in PATH"
  exit 1
fi

conda activate base
conda install -n base -c conda-forge mamba conda-lock -y

pushd "$(dirname "$0")" > /dev/null
"./check-setup.sh" step_conda > /dev/null 2>&1 || { # The first time setting up (after installing pnpm, conda, rclone), user might be using the legacy conda environment
    # check if 'smartride-backend' environment exists, if yes, uninstall
    if conda env list | grep -q '^smartride-backend\s'; then
      echo "[Setup] First time setting up (since version changed). Reinstalling smartride-backend conda environment..."
      echo "[Setup] Uninstalling smartride-backend conda environment."
      conda env remove -n smartride-backend -y
    fi
    conda clean --all -y
}
popd > /dev/null

pushd "$(dirname "$0")/../../../backend" > /dev/null
echo "[Setup] Installing or updating smartride-backend conda environment..."
conda-lock install --mamba --lockfile conda-lock.yml --name smartride-backend
conda activate smartride-backend
echo "[Setup] smartride-backend conda environment is successfully installed and activated."
popd > /dev/null

exit 0