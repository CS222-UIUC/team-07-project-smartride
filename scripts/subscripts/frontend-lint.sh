#!/bin/bash
set -e

cd "$(dirname "$0")/../../frontend"
pnpm install
pnpm test
cd ../scripts/subscripts
