#!/bin/bash
set -e

cd "$(dirname "$0")/subscripts/frontend"

echo "Start frontend workflows..."

SMARTRIDE_ENTRYPOINT="frontend-main" bash lint.sh
SMARTRIDE_ENTRYPOINT="frontend-main" bash test.sh

echo "Compmlete frontend workflows..."

cd ..
