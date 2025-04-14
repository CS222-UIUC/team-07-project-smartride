#!/bin/bash

echo -e "\n[Formatter] Start backend ruff formatter workflow..."
pushd "../backend"
ruff format server
echo -e "\n[Formatter] Backend ruff formatter workflow are completed."
popd

echo -e "\n[Formatter] Start frontend prettier formatter workflow..."
pushd "../frontend"
pnpm prettier --write "src/**/*.{ts,tsx,js,jsx}" 2>&1 | grep -v "(unchanged)"
echo -e "\n[Formatter] Frontend prettier formatter workflow are completed."
popd

echo -e "\n[Formatter] All formatter workflows are completed.\n"