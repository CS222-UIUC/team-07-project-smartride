#!/bin/bash
set -e

if [[ "$SMARTRIDE_ENTRYPOINT" != "run-main" ]]; then
  echo "Error: scripts/subscripts/run/run-easy.sh must be run via scripts/run.sh"
  exit 1
fi

# Start backend
echo "Starting backend..."
osascript -e 'tell application "Terminal" to do script "cd backend && conda activate smartride-backend && python -m server.app"'

# Start frontend
echo "Starting frontend..."
osascript -e 'tell application "Terminal" to do script "cd frontend && pnpm install && pnpm run dev"'

# Start ngrok
echo "Starting ngrok..."
osascript -e 'tell application "Terminal" to do script "ngrok http 5173"'
