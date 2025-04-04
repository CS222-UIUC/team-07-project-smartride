#!/bin/bash
set -e

bash "$(dirname "$0")/subscripts/env/check-conda-imp.sh"

export SMARTRIDE_ENTRYPOINT="run-main"

cd "$(dirname "$0")/subscripts/run"
bash run-easy.sh
