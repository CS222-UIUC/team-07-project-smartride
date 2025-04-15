#!/bin/bash
set -euo pipefail

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <step> <version>"
    exit 1
fi

step="$1"
version="$2"

versionFile="$(dirname "$0")/parameters/lastVersion"
tempFile="$(mktemp)"

if [ -f "$versionFile" ]; then
    awk -v key="$step" '
    {
        line = $0
        sub(/^[ \t]+/, "", line)
        if (line ~ "^" key "[ \t]*=") next
        print
    }
    ' "$versionFile" > "$tempFile"
else
    > "$tempFile"
fi

echo "$step=$version" >> "$tempFile"
mv "$tempFile" "$versionFile"