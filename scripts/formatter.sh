#!/bin/bash

echo -e "\nStart backend ruff formatter workflow...\n"
cd ../backend
ruff format backend
echo -e "\nBackend ruff formatter workflow are completed.\n"

echo -e "\nStart frontend prettier formatter workflow...\n"
cd ../frontend
pnpm prettier --write "**/*.{ts,tsx,css}"
echo -e "\nFrontend prettier formatter workflow are completed.\n"

cd ../scripts
echo -e "\nAll formatter workflows are completed.\n"