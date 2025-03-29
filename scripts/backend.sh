#!/bin/bash
set -e

cd "$(dirname "$0")/subscripts"

echo "Start backend workflows..."

bash backend-test.sh
bash py-type-check.sh
bash update-conda.sh

echo "Complete backend workflows..."

cd ..
