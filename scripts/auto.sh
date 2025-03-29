#!/bin/bash
set -e

cd "$(dirname "$0")/"

echo "Start all workflows..."

bash frontend.sh
bash backend.sh

echo "Complete all workflows..."

cd "$(dirname "$0")/"