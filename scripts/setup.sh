#!/bin/bash
set -euo pipefail

# Paths
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SETUP_DIR="$BASE_DIR/subscripts/setup"
VERSION_FILE="$SETUP_DIR/parameters/lastVersion"

# Step order and version map
if [[ $# -gt 0 && "$1" == --step_* ]]; then
  step="${1:2}"
else
  step="step_all"
fi
setupSteps=("step_rclone" "step_env" "step_cli" "step_conda" "step_drive")
declare -A stepVersions=(
  ["step_rclone"]="1.1"
  ["step_env"]="1.2"
  ["step_cli"]="1.1"
  ["step_conda"]="1.1"
  ["step_drive"]="1.1"
)

pushd "$(dirname "$0")/subscripts/setup" > /dev/null
stepsToRun=()
if [[ "$step" == "step_all" ]]; then
  stepsToRun=("${setupSteps[@]}")
else
  stepsToRun=("$step")
fi
for step in "${stepsToRun[@]}"; do
  echo "[Setup] Running $step..."
  bash "./$step.sh"
  bash "./version-writer.sh" "$step" "${stepVersions[$step]}"
done
popd > /dev/null

# Post-action: Completed
echo "[Setup] To run the project, first run './sync-work.sh --pull' and then './run.sh'. Happy coding!"
