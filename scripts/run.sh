#!/bin/bash
set -e

# Default mode
MODE="--dev"

# Validate input arguments
VALID_MODES=("--dev" "--web" "--android" "--ios")
if [[ $# -gt 0 ]]; then
    if [[ ! " ${VALID_MODES[@]} " =~ " $1 " ]]; then
        echo "Invalid argument: $1" >&2
        echo "Valid options are: --dev, --web, --android, --ios" >&2
        exit 1
    fi
    MODE="$1"
fi

# Ensure setup correctly
bash "$(dirname "$0")/subscripts/setup/check-setup.sh"

# Ensure conda env is imported
bash "$(dirname "$0")/subscripts/env/check-conda-imp.sh"

# Write project mode to .env.auto
ENV_FILE="$(dirname "$0")/../.env.auto"
PROJECT_MODE="BUILD"
if [[ "$MODE" == "--dev" ]]; then
    PROJECT_MODE="DEV"
fi

if [ -f "$ENV_FILE" ]; then
    UPDATED=$(awk -v mode="$PROJECT_MODE" '
        BEGIN { found = 0 }
        /^VITE_PROJECT_MODE=/ {
            print "VITE_PROJECT_MODE=\"" mode "\""
            found = 1
            next
        }
        { print }
        END {
            if (!found) {
                print "VITE_PROJECT_MODE=\"" mode "\""
            }
        }
    ' "$ENV_FILE")
    echo "$UPDATED" > "$ENV_FILE"
else
    echo "VITE_PROJECT_MODE=\"$PROJECT_MODE\"" > "$ENV_FILE"
fi
echo "[INFO] Set VITE_PROJECT_MODE=$PROJECT_MODE"

# Set flag for subprocesses
export SMARTRIDE_ENTRYPOINT="run-main"

# Run by mode
pushd "$(dirname "$0")/subscripts/run" > /dev/null

case "$MODE" in
    "--dev")
        bash run-dev.sh
        ;;
    "--web")
        bash run-build.sh --web
        ;;
    "--android")
        bash run-build.sh --android
        ;;
    "--ios")
        bash run-build.sh --ios
        ;;
    *)
        echo "Invalid argument: $MODE" >&2
        echo "Valid options are: --dev, --web, --android, --ios" >&2
        exit 1
        ;;
esac

popd > /dev/null
