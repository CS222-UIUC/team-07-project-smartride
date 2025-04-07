#!/bin/bash
set -e

TARGET="$1"

if [[ -z "$TARGET" ]]; then
  TARGET="--fullstack"
fi

DIR="$(dirname "$0")"

if [[ "$TARGET" == "--backend" || "$TARGET" == "--fullstack" ]]; then
  bash "$(dirname "$0")/subscripts/env/check-conda-imp.sh"

  pushd "$DIR/subscripts/backend"

  echo "Start backend workflows..."

  SMARTRIDE_ENTRYPOINT="backend-main" bash test.sh
  SMARTRIDE_ENTRYPOINT="backend-main" bash lint.sh

  echo "Backend workflows are completed."

  popd
fi

if [[ "$TARGET" == "--frontend" || "$TARGET" == "--fullstack" ]]; then
  pushd "$DIR/subscripts/frontend"

  echo "Start frontend workflows..."

  SMARTRIDE_ENTRYPOINT="frontend-main" bash lint.sh
  SMARTRIDE_ENTRYPOINT="frontend-main" bash test.sh

  echo "Frontend workflows are completed."

  popd
fi
