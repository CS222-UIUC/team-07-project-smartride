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
./build.sh
if [[ $? -ne 0 ]]; then
  echo "Error: Failed to build project. Aborting..."
  exit 1
fi
popd

# Step 2: Fetch WLAN IP
wlan_ip=$(python "$(dirname "$0")/python/fetch_ip.py")
if [[ $? -ne 0 || -z "$wlan_ip" ]]; then
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

pushd "$(dirname "$0")/../../.."

# Step 4: Start backend
echo "Starting backend..."
gnome-terminal -- bash -c "
cd backend
eval \"\$(conda shell.bash hook)\"
conda activate smartride-backend
python -m server.app
echo 'Press Enter to exit...'
read
"

# Step 5: Start frontend preview or capacitor run
echo "Starting frontend..."
if [[ "$PLATFORM" == "--android" || "$PLATFORM" == "--ios" ]]; then
  deploy_type=$(grep '^VITE_DEPLOY_TARGET=' .env.local | cut -d '=' -f2 | tr -d '"' | sed 's/\s*#.*$//' | xargs)
  emulator_mode=$(grep '^SMARTRIDE_EMULATOR_MODE=' .env.local | cut -d '=' -f2 | tr -d '"' | sed 's/\s*#.*$//' | xargs)

  if [[ "$deploy_type" == "MACHINE" ]]; then
    echo "[SKIP] Target is MACHINE. Skipping 'npx cap run'."
  else
    platform_str=""
    emul_mode_str=""
    if [[ "$PLATFORM" == "--android" ]]; then
      platform_str="android"
    else
      platform_str="ios"
    fi
    if [[ "$emulator_mode" == "RUN" ]]; then
      emul_mode_str="run"
    else
      emul_mode_str="open"
    fi
    gnome-terminal -- bash -c "
cd frontend
pnpm install
pnpm --package='@capacitor/cli' dlx capacitor $emul_mode_str $platform_str
echo 'Press Enter to exit...'
read
"
  fi
else
  gnome-terminal -- bash -c "
cd frontend
pnpm install
pnpm preview
echo 'Press Enter to exit...'
read
"
fi

popd
