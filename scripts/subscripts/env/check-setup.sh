#!/bin/bash
set -euo pipefail

param_dir="$(dirname "$0")/parameters"
last_file="$param_dir/last-setup"
latest_file="$param_dir/latest-setup"

if [ ! -f "$last_file" ] || [ ! -f "$latest_file" ]; then
  echo "[Check Setup] We do not have any record of you running setup yet. Please run or rerun scripts/setup.sh."
  exit 1
fi

last=$(<"$last_file" | xargs)
latest=$(<"$latest_file" | xargs)

vercmp() {
  [ "$(printf '%s\n' "$1" "$2" | sort -V | head -n1)" = "$2" ]
}

if vercmp "$last" "$latest"; then
  echo "[Check Setup] Setup is up-to-date."
  exit 0
else
  echo "[Check Setup] Your last run of setup is with a way older version. Please rerun scripts/setup.sh."
  exit 1
fi
