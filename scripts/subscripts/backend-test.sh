#!/bin/bash

# Move to backend directory
cd ../../backend
conda activate smartride-backend

# Run pytest with coverage
coverage run -m pytest --cov=server tests/
coverage report

cd ../scripts/subscripts