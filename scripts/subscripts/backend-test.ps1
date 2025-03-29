# Move to backend directory
Set-Location ../../backend

# Activate conda env
conda activate smartride-backend

# Run pytest with coverage
coverage run -m pytest --cov=server tests/
coverage report

Set-Location ../scripts/subscripts