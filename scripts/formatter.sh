#!/bin/bash

cd ..

echo -e "\n=== Formatting Python Backend (ruff) ===\n"
ruff format backend

echo -e "\n=== Formatting Frontend (prettier) ===\n"
cd frontend
pnpm prettier --write "**/*.{ts,tsx,css}"
