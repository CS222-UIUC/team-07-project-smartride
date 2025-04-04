#!/bin/bash
set -e

if [[ "$SMARTRIDE_ENTRYPOINT" != "run-main" ]]; then
  echo "Error: scripts/subscripts/run/run-easy.sh must be run via scripts/run.sh"
  exit 1
fi

pushd "$(dirname "$0")/../../.."

# Start backend
echo "Starting backend..."
osascript -e 'tell application "Terminal" to do script "cd '$(pwd)'; pwd; cd backend && conda activate smartride-backend && python -m server.app; echo; echo Press Enter to exit...; read"'

# Start frontend
echo "Starting frontend..."
osascript -e 'tell application "Terminal" to do script "cd '$(pwd)'; pwd; cd frontend && pnpm install && pnpm run dev; echo; echo Press Enter to exit...; read"'

# Start ngrok
echo "Starting ngrok..."
osascript -e 'tell application "Terminal" to do script "ngrok http 5173; echo; echo Press Enter to exit...; read"'

popd
