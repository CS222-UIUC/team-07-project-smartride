#!/bin/bash
set -euo pipefail

param_dir="$(dirname "$0")/parameters"
last_file="$param_dir/last-setup"
latest_file="$param_dir/latest-setup"

if [ ! -f "$last_file" ] || [ ! -f "$latest_file" ]; then
  echo "[Check Setup] Missing last-setup or latest-setup file."
  exit 1
fi

last=$(<"$last_file")
latest=$(<"$latest_file")

if [ "$last" = "$latest" ]; then
  echo "[Check Setup] Setup hash is up-to-date."
  exit 0
else
  echo "[Check Setup] Setup hash is outdated. Please rerun scripts/setup.sh."
  exit 1
fi
