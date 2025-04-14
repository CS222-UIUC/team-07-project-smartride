#!/bin/bash
set -euo pipefail

pushd "$(dirname "$0")/../../../rclone" > /dev/null

# Step 1: Check rclone.conf
if [ ! -f "rclone.conf" ]; then
  cp rclone.conf.example rclone.conf
fi

rcloneText=$(<rclone.conf)
if [[ $rcloneText =~ token[[:space:]]*=[[:space:]]*(\{.*\}) ]]; then
  tokenJson="${BASH_REMATCH[1]}"
  requiredFields=("access_token" "token_type" "refresh_token" "expiry")
  missingFields=()
  for field in "${requiredFields[@]}"; do
    if ! echo "$tokenJson" | jq -e ".${field} | select(. != null and . != \"\")" > /dev/null; then
      missingFields+=("$field")
    fi
  done
  if [ ${#missingFields[@]} -gt 0 ]; then
    echo "Error: rclone.conf is missing or has empty fields: ${missingFields[*]}. Please complete it."
    popd > /dev/null
    exit 1
  else
    echo "[Setup] rclone.conf is valid."
  fi
else
  echo "Error: token section not found in rclone.conf."
  popd > /dev/null
  exit 1
fi

popd > /dev/null

exit 0