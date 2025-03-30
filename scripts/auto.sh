#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "Start all workflows..."

bash backend.sh
backend_status=$?
if [ $backend_status -ne 0 ]; then
  echo "Backend workflow failed, stop executing auto.sh"
  exit $backend_status
fi

bash frontend.sh
frontend_status=$?
if [ $frontend_status -ne 0 ]; then
  echo "Frontend workflow failed, stop executing auto.sh"
  exit $frontend_status
fi

echo "All workflows are completed."

cd "$(dirname "$0")"