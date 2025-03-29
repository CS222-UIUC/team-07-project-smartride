#!/bin/bash
set -e

cd "$(dirname "$0")/subscripts"

echo "Start frontend workflows..."

bash frontend-lint.sh
bash frontend-test.sh

echo "Compmlete frontend workflows..."

cd ..
