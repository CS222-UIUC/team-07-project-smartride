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
exampleAutoLines=$(grep -E '^\s*[^#=\s]+\s*=' .env.auto.example || true)
autoLines=$(grep -E '^\s*[^#=\s]+\s*=' .env.auto || true)

declare -A exampleAutoKeys
while IFS= read -r line; do
    if [[ $line =~ ^\s*([^#=\s]+)\s*=\s*(.*)$ ]]; then
        key="${BASH_REMATCH[1]}"
        val="${BASH_REMATCH[2]}"
        exampleAutoKeys["$key"]="$val"
    fi
done <<< "$exampleAutoLines"

autoKeys=()
while IFS= read -r line; do
    if [[ $line =~ ^\s*([^#=\s]+)\s*=\s* ]]; then
        autoKeys+=("${BASH_REMATCH[1]}")
    fi
done <<< "$autoLines"

missingAutoKeys=()
for key in "${!exampleAutoKeys[@]}"; do
    if [[ ! " ${autoKeys[*]} " =~ " $key " ]]; then
        missingAutoKeys+=("$key")
    fi
done

if [ ${#missingAutoKeys[@]} -gt 0 ]; then
    echo -e "\n# --- Missing entries from .env.auto.example added below ---" >> .env.auto
    for key in "${missingAutoKeys[@]}"; do
        echo "$key=${exampleAutoKeys[$key]}" >> .env.auto
    done
    echo "[Setup] New entries were added to .env.auto based on .env.auto.example. You should NOT modify any value in there by hand."
else
    echo "[Setup] All expected entries from .env.auto.example are already present in .env.auto."
fi



get_git_user_or_exit() {
    if git config user.name >/dev/null 2>&1; then
        gitUser=$(git config user.name || true)
    else
        gitUser=""
    fi
    if [ -z "$gitUser" ]; then
        echo "Error: Git user.name is not set. Please configure it using:" >&2
        echo "       git config --global user.name \"Your Name\"" >&2
        popd > /dev/null || true
        exit 1
    fi
    echo "$gitUser" >&1
}

committerLine=$(grep -E '^COMMITTER\s*=\s*.*' .env.local || true)
if [ -n "$committerLine" ]; then
    committerValue=$(echo "$committerLine" | sed -E 's/^COMMITTER\s*=\s*//;s/\"//g')
    if [[ -z "$committerValue" || "$committerValue" =~ ^[[:space:]]*$ || "$committerValue" =~ ^\<.*\>$ ]]; then
        gitUser=$(get_git_user_or_exit)
        echo "Git user.name is set to: $gitUser"
        if sed --version >/dev/null 2>&1; then
            # GNU sed
            sed -i -E "s/^COMMITTER\s*=.*/COMMITTER=\"$gitUser\"/" .env.local
        else
            # BSD sed
            sed -i '' -E "s/^COMMITTER\s*=.*/COMMITTER=\"$gitUser\"/" .env.local
        fi
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