#!/bin/bash
set -e

cd "$(dirname "$0")/"

echo "Start all workflows..."

bash backend.sh
bash frontend.sh

echo "Complete all workflows..."

cd "$(dirname "$0")/"