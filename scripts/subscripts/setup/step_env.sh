#!/bin/bash
set -euo pipefail

pushd "$(dirname "$0")/../../.." > /dev/null
[ ! -f .env.local ] && cp .env.local.example .env.local
[ ! -f .env.auto ] && cp .env.auto.example .env.auto
[ ! -f .env.shared ] && cp .env.shared.example .env.shared

# Check for missing entries in .env.local compared to .env.local.example
exampleLines=$(grep -E '^\s*[^#=\s]+\s*=' .env.local.example || true)
localLines=$(grep -E '^\s*[^#=\s]+\s*=' .env.local || true)

declare -A exampleKeys
while IFS= read -r line; do
    if [[ $line =~ ^\s*([^#=\s]+)\s*=\s*(.*)$ ]]; then
        key="${BASH_REMATCH[1]}"
        val="${BASH_REMATCH[2]}"
        exampleKeys["$key"]="$val"
    fi
done <<< "$exampleLines"

localKeys=()
while IFS= read -r line; do
    if [[ $line =~ ^\s*([^#=\s]+)\s*=\s* ]]; then
        localKeys+=("${BASH_REMATCH[1]}")
    fi
done <<< "$localLines"

missingKeys=()
for key in "${!exampleKeys[@]}"; do
    if [[ ! " ${localKeys[*]} " =~ " $key " ]]; then
        missingKeys+=("$key")
    fi
done

if [ ${#missingKeys[@]} -gt 0 ]; then
    echo -e "\n# --- Missing entries from .env.local.example added below ---" >> .env.local
    for key in "${missingKeys[@]}"; do
        echo "$key=${exampleKeys[$key]}" >> .env.local
    done
    echo "[Setup] New entries were added to .env.local based on .env.local.example. Please check if any placeholder values (e.g., <...>) need to be filled in."
else
    echo "[Setup] All expected entries from .env.local.example are already present in .env.local."
fi


# Check for missing entries in .env.auto compared to .env.auto.example
exampleLines=$(grep -E '^\s*[^#=\s]+\s*=' .env.auto.example || true)
autoLines=$(grep -E '^\s*[^#=\s]+\s*=' .env.auto || true)

declare -A exampleKeys
while IFS= read -r line; do
    if [[ $line =~ ^\s*([^#=\s]+)\s*=\s*(.*)$ ]]; then
        key="${BASH_REMATCH[1]}"
        val="${BASH_REMATCH[2]}"
        exampleKeys["$key"]="$val"
    fi
done <<< "$exampleLines"

autoKeys=()
while IFS= read -r line; do
    if [[ $line =~ ^\s*([^#=\s]+)\s*=\s* ]]; then
        autoKeys+=("${BASH_REMATCH[1]}")
    fi
done <<< "$autoLines"

missingKeys=()
for key in "${!exampleKeys[@]}"; do
    if [[ ! " ${autoKeys[*]} " =~ " $key " ]]; then
        missingKeys+=("$key")
    fi
done

if [ ${#missingKeys[@]} -gt 0 ]; then
    echo -e "\n# --- Missing entries from .env.auto.example added below ---" >> .env.auto
    for key in "${missingKeys[@]}"; do
        echo "$key=${exampleKeys[$key]}" >> .env.auto
    done
    echo "[Setup] New entries were added to .env.auto based on .env.auto.example. You should NOT modify any value in there by hand."
else
    echo "[Setup] All expected entries from .env.auto.example are already present in .env.auto."
fi



get_git_user_or_exit() {
  gitUser=$(git config user.name 2>/dev/null || true)
  if [ -z "$gitUser" ]; then
    echo "Error: Git user.name is not set. Please configure it using:"
    echo "       git config --global user.name \"Your Name\""
    popd > /dev/null
    exit 1
  fi
  echo "$gitUser"
}

committerLine=$(grep -E '^COMMITTER\s*=\s*.*' .env.local || true)
if [ -n "$committerLine" ]; then
  committerValue=$(echo "$committerLine" | sed -E 's/^COMMITTER\s*=\s*//;s/\"//g')
  if [[ -z "$committerValue" || "$committerValue" =~ ^[[:space:]]*$ || "$committerValue" =~ ^<.*>$ ]]; then
    gitUser=$(get_git_user_or_exit)
    echo "Git user.name is set to: $gitUser"
    sed -i '' -E "s/^COMMITTER\s*=.*/COMMITTER=\"$gitUser\"/" .env.local
    echo "[Setup] COMMITTER is now set to '$gitUser' in .env.local. Change it manually if user.name is not your GitHub username."
  else
    echo "[Setup] .env.local is valid."
  fi
else
  gitUser=$(get_git_user_or_exit)
  echo "Git user.name is set to: $gitUser"
  if grep -q '^# Committer$' .env.local; then
    awk -v u="$gitUser" '/^# Committer$/{print; print "COMMITTER=\"" u "\""; next}1' .env.local > .env.local.tmp && mv .env.local.tmp .env.local
  else
    { echo "# Committer"; echo "COMMITTER=\"$gitUser\""; cat .env.local; } > .env.local.tmp && mv .env.local.tmp .env.local
  fi
  echo "[Setup] COMMITTER is now inserted as '$gitUser' in .env.local. Change it manually if user.name is not your GitHub username."
  popd > /dev/null
  exit 0
fi

popd > /dev/null

exit 0