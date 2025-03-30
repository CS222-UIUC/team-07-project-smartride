#!/bin/bash
set -e

if [[ "$SMARTRIDE_ENTRYPOINT" != "run-main" ]]; then
  echo "Error: scripts/subscripts/run/run-easy.sh must be run via scripts/run.sh"
  exit 1
fi

ALLOW_FILE="$(dirname "$0")/parameters/allow-easy"
if [[ ! -f "$ALLOW_FILE" || "$(cat "$ALLOW_FILE")" != "1" ]]; then
  echo "Error: Cannot run easy mode. Please run full setup first by run.sh --full"
  echo "0" > "$ALLOW_FILE"
  exit 1
fi

cd ../../..

echo "Pulling latest changes from git..."
git pull

# Start backend
echo "Starting backend..."
osascript <<EOF
tell application "Terminal"
    do script "cd \"$(pwd)/backend\" && conda activate smartride-backend && python -m server.app"
end tell
EOF

# Start frontend
echo "Starting frontend..."
osascript <<EOF
tell application "Terminal"
    do script "cd \"$(pwd)/frontend\" && pnpm install && pnpm run dev"
end tell
EOF

# Start ngrok
echo "Starting ngrok..."
osascript <<EOF
tell application "Terminal"
    do script "cd \"$(pwd)\" && ngrok http 5173"
end tell
EOF
