#!/bin/bash
set -e

ALLOW_FILE="$(dirname "$0")/subscripts/run/parameters/allow-easy"
if [[ ! -f "$ALLOW_FILE" || "$(cat "$ALLOW_FILE")" != "1" ]]; then
  echo "Error: Cannot perform backend check workflow. Please run full setup first by run.ps1 --full"
  echo "0" > "$ALLOW_FILE"
  exit 1
fi

cd "$(dirname "$0")/subscripts/backend"

echo "Start backend workflows..."

SMARTRIDE_ENTRYPOINT="backend-main" bash test.sh
SMARTRIDE_ENTRYPOINT="backend-main" bash lint.sh
SMARTRIDE_ENTRYPOINT="backend-main" bash upconda.sh

echo "Complete backend workflows..."

cd ..
