#!/bin/bash

echo -e "\n[Formatter] Start backend ruff formatter workflow..."
cd ../backend
ruff format backend > /dev/null
echo -e "\n[Formatter] Backend ruff formatter workflow are completed."

echo -e "\n[Formatter] Start frontend prettier formatter workflow..."
cd ../frontend
pnpm prettier --write "**/*.{ts,tsx,css}" > /dev/null
echo -e "\n[Formatter] Frontend prettier formatter workflow are completed."

cd ../scripts
echo -e "\n[Formatter] All formatter workflows are completed.\n"