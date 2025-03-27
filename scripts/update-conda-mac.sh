#!/bin/bash

# Export updated conda environment (macOS)

echo "[Backend] Exporting conda environment to conda_env_mac.yml..."
cd ../backend
conda activate smartride-backend
conda env export --no-builds > conda_env_mac.yml
