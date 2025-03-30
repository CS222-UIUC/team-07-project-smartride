#!/bin/bash
set -e

TARGET="$1"

if [[ -z "$TARGET" ]]; then
  TARGET="--fullstack"
fi

DIR="$(dirname "$0")"

if [[ "$TARGET" == "--backend" || "$TARGET" == "--fullstack" ]]; then
  ALLOW_FILE="$DIR/subscripts/run/parameters/allow-easy"
  if [[ ! -f "$ALLOW_FILE" || "$(cat "$ALLOW_FILE")" != "1" ]]; then
    echo "Error: Cannot perform backend check workflow. Please run full setup first by run.sh --full"
    echo "0" > "$ALLOW_FILE"
    exit 1
  fi

  cd "$DIR/subscripts/backend"

  echo "Start backend workflows..."

  SMARTRIDE_ENTRYPOINT="backend-main" bash test.sh
  SMARTRIDE_ENTRYPOINT="backend-main" bash lint.sh
  SMARTRIDE_ENTRYPOINT="backend-main" bash upconda.sh

  echo "Complete backend workflows..."

  cd "$DIR"
fi

if [[ "$TARGET" == "--frontend" || "$TARGET" == "--fullstack" ]]; then
  cd "$DIR/subscripts/frontend"

  echo "Start frontend workflows..."

  SMARTRIDE_ENTRYPOINT="frontend-main" bash lint.sh
  SMARTRIDE_ENTRYPOINT="frontend-main" bash test.sh

  echo "Compmlete frontend workflows..."

  cd "$DIR"
fi
