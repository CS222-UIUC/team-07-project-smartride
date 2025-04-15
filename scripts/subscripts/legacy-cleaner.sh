#!/bin/bash

# Array of legacy files to clean
legacyFiles=(
    "$(dirname "$0")/env/parameters/processing_conda"
    "$(dirname "$0")/env/parameters/latest-setup"
)

# Iterate through each file and attempt to clean
for file in "${legacyFiles[@]}"; do
    if [ -e "$file" ]; then
        if rm -f "$file"; then
            echo "Successfully cleaned: $file"
        else
            echo "Failed to clean: $file"
        fi
    else
        echo "File already cleaned or does not exist: $file"
    fi
done