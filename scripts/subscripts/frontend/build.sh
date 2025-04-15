#!/bin/sh

pushd "$(dirname "$0")/../../../frontend" > /dev/null || exit

echo "[Frontend Build] Building the frontend project..."

# Install dependencies and build the project
pnpm install
pnpm run build

echo "[Frontend Build] The building is complete."

popd > /dev/null