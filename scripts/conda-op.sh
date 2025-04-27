#!/bin/bash
set -e

export SMARTRIDE_ENTRYPOINT="conda-op"

CMD="$1"

pushd "$(dirname "$0")/subscripts/env" > /dev/null
case "$CMD" in
  --install)
    shift
    bash "inst-conda.sh" --package "$@"
    ;;
  --lock)
    bash "lock-conda.sh"
    ;;
  --import)
    bash "imp-conda.sh"
    ;;
  *)
    echo "Usage: conda-op.sh [--install <pkg_name> [--pip]] | [--lock] | [--import]"
    exit 1
    ;;
esac
popd > /dev/null