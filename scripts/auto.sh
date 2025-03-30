#!/bin/bash
set -e

cd "$(dirname "$0")"

bash check.sh --fullstack
bash formatter.sh
