#!/bin/bash

cd ..

echo -e "\n=== Running Ruff Fix ===\n"
ruff check backend --fix --diff

echo -e "\n=== Running mypy ===\n"
mypy backend