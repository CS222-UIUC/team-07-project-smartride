#!/bin/bash
set -e

if [[ "$SMARTRIDE_ENTRYPOINT" != "run-main" ]]; then
  echo "Error: scripts/subscripts/run/run-build.sh must be run via scripts/run.sh"
  exit 1
fi

if [[ "$1" != "--web" && "$1" != "--android" && "$1" != "--ios" ]]; then
  echo "Error: Invalid option. Use --web, --android or --ios."
  exit 1
fi

PLATFORM="$1"

# Step 1: Build frontend
pushd "$(dirname "$0")/../frontend"
bash "./build.sh"
popd

# Step 2: Fetch WLAN IP
wlan_ip=$(python "$(dirname "$0")/python/fetch_ip.py")
if [[ -z "$wlan_ip" ]]; then
  echo "Error: fetch_ip.py failed or returned empty string."
  exit 1
fi
echo "[INFO] Retrieved WLAN IP: $wlan_ip"

# Step 3: Update VITE_WLAN_IP in .env.auto
auto_env_path="$(dirname "$0")/../../../.env.auto"
if grep -q '^VITE_WLAN_IP=' "$auto_env_path"; then
  sed -i "s|^VITE_WLAN_IP=.*|VITE_WLAN_IP=\"$wlan_ip\"|" "$auto_env_path"
else
  echo "VITE_WLAN_IP=\"$wlan_ip\"" >> "$auto_env_path"
fi

run_capacitor_if_needed() {
  local prefix="$1"
  local postfix="$2"
  local run_cmd=""

  if [[ "$PLATFORM" == "--android" || "$PLATFORM" == "--ios" ]]; then
    local deploy_type=$(grep '^VITE_DEPLOY_TARGET=' .env.local | cut -d '=' -f2 | tr -d '"' | sed 's/\s*#.*$//' | xargs)
    local emulator_mode=$(grep '^SMARTRIDE_EMULATOR_MODE=' .env.local | cut -d '=' -f2 | tr -d '"' | sed 's/\s*#.*$//' | xargs)
    cd frontend
    local platform_str="android"
    [[ "$PLATFORM" == "--ios" ]] && platform_str="ios"
    pnpm install
    pnpm --package="@capacitor/cli" dlx capacitor sync $platformStr
    echo "Sync Completed."
    if [[ "$deploy_type" == "MACHINE" ]]; then
      run_cmd="echo '[SKIP] Target is MACHINE. Skipping npx cap run.'"
    elif [[ "$emulator_mode" == "NONE" ]]; then
      run_cmd="echo '[SKIP] Emulator Mode is NONE. Skipping npx cap run.'"
    else
      local emul_mode_str="open"
      [[ "$emulator_mode" == "RUN" ]] && emul_mode_str="run"
      run_cmd="bash -c 'echo -e \"\033[0;35mPress Enter to continue with '$emul_mode_str $platform_str'...\033[0m\"; read -r; pnpm --package=\"@capacitor/cli\" dlx capacitor $emul_mode_str $platform_str; echo \"Press Enter to exit...\"; read -r'"
    fi
  else
    run_cmd="cd frontend && pnpm install && pnpm preview"
  fi

  eval "$prefix \"$run_cmd\" $postfix"
}

pushd "$(dirname "$0")/../../.."

platform=$(uname)
if [[ "$platform" != "Darwin" && "$platform" != "Linux" ]]; then
  echo "[run] Unsupported platform: $platform"
  exit 1
fi

if [[ "$platform" == "Linux" ]]; then
  SESSION="smartride-build"
  if tmux has-session -t "$SESSION" 2>/dev/null; then
    echo "[run-build] tmux session '$SESSION' already exists. Attach with: tmux attach -t $SESSION"
    exit 0
  fi
  tmux new-session -d -s "$SESSION" -n backend
  tmux send-keys -t "$SESSION:0.0" "cd backend && eval \$(conda shell.bash hook) && conda activate smartride-backend && python -m server.app" C-m
  tmux split-window -h -t "$SESSION:0"
  run_capacitor_if_needed "tmux send-keys -t \"$SESSION:0.1\"" "C-m"
  tmux attach -t "$SESSION"
else
  osascript -e 'tell application "Terminal" to do script "cd backend && eval $(conda shell.bash hook) && conda activate smartride-backend && python -m server.app"'
  run_capacitor_if_needed 'osascript -e "tell application \"Terminal\" to do script' '"\""'
fi

popd
