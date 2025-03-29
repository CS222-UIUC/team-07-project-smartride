#!/bin/bash

cd ../backend

echo -e "\n=== Running Ruff Fix ===\n"
ruff check server --fix --diff

echo -e "\n=== Running mypy ===\n"
mypy server

cd ../scripts/subscripts