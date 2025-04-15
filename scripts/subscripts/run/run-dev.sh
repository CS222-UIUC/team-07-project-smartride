#!/bin/bash
set -e

if [[ "$SMARTRIDE_ENTRYPOINT" != "run-main" ]]; then
  echo "Error: scripts/subscripts/run/run-dev.sh must be run via scripts/run.sh"
  exit 1
fi

pushd "$(dirname "$0")/../../.."

platform=$(uname)
if [[ "$platform" != "Darwin" && "$platform" != "Linux" ]]; then
  echo "[run] Unsupported platform: $platform"
  exit 1
fi

if [[ "$platform" == "Linux" ]]; then
  SESSION="smartride-dev"
  if tmux has-session -t "$SESSION" 2>/dev/null; then
    echo "[run-dev] tmux session '$SESSION' already exists. Attach with: tmux attach -t $SESSION"
    exit 0
  fi
  tmux new-session -d -s "$SESSION" -n backend
  tmux send-keys -t "$SESSION:0.0" "cd backend && eval \$(conda shell.bash hook) && conda activate smartride-backend && python -m server.app" C-m
  tmux split-window -h -t "$SESSION:0"
  tmux send-keys -t "$SESSION:0.1" "cd frontend && pnpm install && pnpm run dev" C-m
  tmux attach -t "$SESSION"
else
  osascript -e 'tell application "Terminal" to do script "cd backend && eval $(conda shell.bash hook) && conda activate smartride-backend && python -m server.app"'
  osascript -e 'tell application "Terminal" to do script "cd frontend && pnpm install && pnpm run dev"'
fi

popd
