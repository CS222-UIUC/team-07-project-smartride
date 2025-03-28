#!/bin/bash

echo -e "\n=== Formatting Python Backend (ruff) ===\n"
cd ../backend
ruff format backend

echo -e "\n=== Formatting Frontend (prettier) ===\n"
cd ../frontend
pnpm prettier --write "**/*.{ts,tsx,css}"

cd ../scripts