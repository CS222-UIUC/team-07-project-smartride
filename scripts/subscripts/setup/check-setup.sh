#!/bin/bash

set -euo pipefail

step="${1:-step_global}"
paramDir="$(dirname "$0")/parameters"
requiredFile="$paramDir/requiredVersion"
lastFile="$paramDir/lastVersion"
oldGlobalFile="$(dirname "$0")/../env/parameters/last-setup"
versionWriter="$(dirname "$0")/version-writer.sh"

if [[ ! -f "$requiredFile" ]]; then
  echo "[Check Setup] Missing requiredVersion file. Please run setup.sh -admin first." >&2
  exit 1
fi

if [[ ! -f "$lastFile" && ! -f "$oldGlobalFile" ]]; then
  echo "[Check Setup] No setup history found. Please run scripts/setup.sh." >&2
  exit 1
fi

# Read required versions
declare -A requiredVersions
while IFS='=' read -r key value; do
  [[ -n "$key" && -n "$value" ]] && requiredVersions["$key"]=$(echo "$value" | xargs)
done < "$requiredFile"

# Read last versions (either full map or old fallback)
declare -A lastVersions
usedOldFallback=false
fallbackVersion=""

if [[ -f "$lastFile" ]]; then
  while IFS='=' read -r key value; do
    [[ -n "$key" && -n "$value" ]] && lastVersions["$key"]=$(echo "$value" | xargs)
  done < "$lastFile"
elif [[ -f "$oldGlobalFile" ]]; then
  fallbackVersion=$(<"$oldGlobalFile" | xargs)
  if ! [[ "$fallbackVersion" =~ ^[0-9]+(\.[0-9]+)*$ ]]; then
    echo "[Check Setup] Invalid old setup version record. Please rerun scripts/setup.sh." >&2
    exit 1
  fi
  usedOldFallback=true
fi

# Determine which steps to check
if [[ "$step" == "step_global" ]]; then
  stepsToCheck=("${!requiredVersions[@]}")
else
  stepsToCheck=("$step")
fi

# Replace old fallback version if needed
if [[ "$usedOldFallback" == true ]]; then
  echo "[Check Setup] Detected old setup record. Migrating to per-step version tracking..." >&2
  for s in "${!requiredVersions[@]}"; do
    "$versionWriter" -step "$s" -version "$fallbackVersion"
  done
  rm -f "$oldGlobalFile"
  echo "[Check Setup] Migration complete." >&2
  exit 1
fi

# Compare
outdated=()
for s in "${stepsToCheck[@]}"; do
  if [[ -z "${requiredVersions[$s]:-}" ]]; then
    echo "[Warning] Step '${s}' not found in requiredVersion file. Skipping..." >&2
    continue
  fi
  required="${requiredVersions[$s]}"
  if [[ "$usedOldFallback" == true ]]; then
    actual="$fallbackVersion"
  elif [[ -n "${lastVersions[$s]:-}" ]]; then
    actual="${lastVersions[$s]}"
  else
    outdated+=("$s")
    echo "[Outdated] ${s}: missing (required ${required}). Please rerun scripts/setup.sh --${s}" >&2
    continue
  fi

  if [[ "$(echo -e "$actual\n$required" | sort -V | head -n1)" != "$required" ]]; then
    outdated+=("$s")
    echo "[Outdated] ${s}: ${actual} < required ${required}. Please rerun scripts/setup.sh --${s}" >&2
  fi
done

if [[ "${#outdated[@]}" -gt 0 ]]; then
  echo "[Check Setup] One or more setup steps are outdated." >&2
  exit 1
else
  echo "[Check Setup] Setup is up-to-date."
  exit 0
fi
