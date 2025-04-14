#!/bin/bash
set -e

bash "$(dirname "$0")/subscripts/env/check-conda-imp.sh"
if [ $? -ne 0 ]; then
    exit 1
fi

export SMARTRIDE_ENTRYPOINT="run-main"

if [[ "$1" == "--build" ]]; then
    pushd "$(dirname "$0")/subscripts/run" > /dev/null
    bash run-build.sh
    popd > /dev/null
elif [[ "$#" -eq 0 || "$1" == "--dev" ]]; then
    pushd "$(dirname "$0")/subscripts/run" > /dev/null
    bash run-dev.sh
    popd > /dev/null
else
    echo "Invalid argument. Please use '--build' or '--dev' (default if no parameter) as a parameter." >&2
    exit 1
fi
