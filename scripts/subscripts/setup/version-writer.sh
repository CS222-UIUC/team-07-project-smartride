#!/bin/bash
set -euo pipefail

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <step> <version>"
    exit 1
fi

step="$1"
version="$2"

versionFile="$(dirname "$0")/../parameters/lastVersion"
tempFile="$(mktemp)"

if [ -f "$versionFile" ]; then
    grep -vE "^\s*$step\s*=" "$versionFile" > "$tempFile"
fi

echo "$step=$version" >> "$tempFile"
mv "$tempFile" "$versionFile"