#!/bin/bash
set -euo pipefail

pushd "$(dirname "$0")/../rclone" > /dev/null

# Step 1: Check rclone.conf
if [ ! -f "rclone.conf" ]; then
  cp rclone.conf.example rclone.conf
fi

rcloneText=$(<rclone.conf)
if [[ $rcloneText =~ token[[:space:]]*=[[:space:]]*(\{.*\}) ]]; then
  tokenJson="${BASH_REMATCH[1]}"
  requiredFields=("access_token" "token_type" "refresh_token" "expiry")
  missingFields=()
  for field in "${requiredFields[@]}"; do
    if ! echo "$tokenJson" | jq -e ".${field} | select(. != null and . != \"\")" > /dev/null; then
      missingFields+=("$field")
    fi
  done
  if [ ${#missingFields[@]} -gt 0 ]; then
    echo "Error: rclone.conf is missing or has empty fields: ${missingFields[*]}. Please complete it."
    popd > /dev/null
    exit 1
  else
    echo "[Setup] rclone.conf is valid."
  fi
else
  echo "Error: token section not found in rclone.conf."
  popd > /dev/null
  exit 1
fi

popd > /dev/null

# Step 2: Check .env.local and .env.shared
pushd "$(dirname "$0")/.." > /dev/null
[ ! -f .env.local ] && cp .env.local.example .env.local
[ ! -f .env.shared ] && cp .env.shared.example .env.shared

get_git_user_or_exit() {
  gitUser=$(git config user.name 2>/dev/null || true)
  if [ -z "$gitUser" ]; then
    echo "Error: Git user.name is not set. Please configure it using:"
    echo "       git config --global user.name \"Your Name\""
    popd > /dev/null
    exit 1
  fi
  echo "$gitUser"
}

committerLine=$(grep -E '^COMMITTER\s*=\s*.*' .env.local || true)
if [ -n "$committerLine" ]; then
  committerValue=$(echo "$committerLine" | sed -E 's/^COMMITTER\s*=\s*//;s/\"//g')
  if [[ -z "$committerValue" || "$committerValue" =~ ^[[:space:]]*$ || "$committerValue" =~ ^<.*>$ ]]; then
    gitUser=$(get_git_user_or_exit)
    echo "Git user.name is set to: $gitUser"
    sed -i '' -E "s/^COMMITTER\s*=.*/COMMITTER=\"$gitUser\"/" .env.local
    echo "[Setup] COMMITTER is now set to '$gitUser' in .env.local. Change it manually if user.name is not your GitHub username."
  else
    echo "[Setup] .env.local is valid."
  fi
else
  gitUser=$(get_git_user_or_exit)
  echo "Git user.name is set to: $gitUser"
  if grep -q '^# Committer$' .env.local; then
    awk -v u="$gitUser" '/^# Committer$/{print; print "COMMITTER=\"" u "\""; next}1' .env.local > .env.local.tmp && mv .env.local.tmp .env.local
  else
    { echo "# Committer"; echo "COMMITTER=\"$gitUser\""; cat .env.local; } > .env.local.tmp && mv .env.local.tmp .env.local
  fi
  echo "[Setup] COMMITTER is now inserted as '$gitUser' in .env.local. Change it manually if user.name is not your GitHub username."
  popd > /dev/null
  exit 0
fi

popd > /dev/null

# Step 3-7: Install required tools
installed_miniconda=false
installed_fnm_node=false
missing_tools=()

# Helper: Check and append if not found
check_tool() {
  if ! command -v "$1" &>/dev/null; then
    missing_tools+=("$1")
  else
    echo "[Setup] $2 CLI is already installed."
  fi
}

check_tool rclone "rclone"
check_tool pnpm "pnpm"
check_tool node "Node.js"
check_tool conda "Conda"

if [ ${#missing_tools[@]} -gt 0 ]; then
  echo "[Setup] The following tools are missing: ${missing_tools[*]}"
  read -p "[Setup] Do you want to install them now? (Y/N): " choice
  if [[ "$choice" != "Y" && "$choice" != "y" ]]; then
    echo "[Setup] Please install them manually, then rerun this script. Aborting."
    exit 1
  fi

  for tool in "${missing_tools[@]}"; do
    case $tool in
      rclone)
        echo "[Setup] Installing rclone..."
        sudo -v && curl https://rclone.org/install.sh | sudo bash
        echo "[Setup] rclone CLI is successfully installed."
        ;;
      pnpm)
        echo "[Setup] Installing pnpm..."
        curl -fsSL https://get.pnpm.io/install.sh | sh -
        echo "[Setup] pnpm CLI is successfully installed."
        ;;
      node)
        echo "[Setup] Installing Node.js via fnm..."
        curl -o- https://fnm.vercel.app/install | bash
        export PATH="$HOME/.fnm:$PATH"
        export PATH="$HOME/.fnm/current/bin:$PATH"
        eval "$(fnm env)"
        fnm install 22
        installed_fnm_node=true
        echo "[Setup] Node.js is successfully installed."
        ;;
      conda)
        echo "[Setup] Installing Miniconda3..."
        mkdir -p ~/miniconda3
        curl https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh -o ~/miniconda3/miniconda.sh
        bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
        rm ~/miniconda3/miniconda.sh
        installed_miniconda=true
        echo "[Setup] Miniconda successfully installed to ~/miniconda3"
        ;;
    esac
  done

  echo "[Setup] All requested tools have been installed. Please restart your shell and rerun this script."
  exit 0
fi


# Step 8: Warn if ngrok is missing
if ! command -v ngrok &> /dev/null; then
  echo "[Warning] ngrok not found. Please sign up at ngrok.com and install it manually."
fi

# Step 9: Require restart if certain downloads happened
needs_restart=false
if $installed_miniconda || $installed_fnm_node; then
  needs_restart=true
fi

if $needs_restart; then
  echo "[Setup] One or more tools require terminal restart (e.g., Miniconda3, Node.js via fnm)."
  if $installed_miniconda; then
    echo "[Setup] Miniconda3 installed. Please run the following commands before rerunning this script:"
    echo "       source ~/miniconda3/bin/activate"
    echo "       conda init --all"
  fi
  append_instruction=""
  if $installed_miniconda; then
    append_instruction=", follow the instructions above"
  fi
  echo "[Setup] Please restart your terminal (NOT just this script)${append_instruction} and rerun this script."
  exit 0
fi

# Step 10: Check if conda is available in PATH
if ! command -v conda &> /dev/null; then
  echo "[Setup] Conda not found in PATH. Please make sure to run:"
  echo "       source ~/miniconda3/bin/activate"
  echo "       conda init --all"
  exit 1
fi

# Step 11: Setup conda environment
if command -v conda &> /dev/null; then
  eval "$(conda shell.bash hook)"
else
  echo "Conda not found in PATH"
  exit 1
fi

conda activate base
conda install -n base -c conda-forge mamba conda-lock -y

pushd "$(dirname "$0")/subscripts/env" > /dev/null
"./check-setup.sh" >/dev/null 2>&1 || { # The first time setting up (after installing pnpm, conda, rclone), user might be using the legacy conda environment
    # check if 'smartride-backend' environment exists, if yes, uninstall
    if conda env list | grep -q '^smartride-backend\s'; then
      echo "[Setup] First time setting up (since version changed). Reinstalling smartride-backend conda environment..."
      echo "[Setup] Uninstalling smartride-backend conda environment."
      conda env remove -n smartride-backend -y
    fi
    conda clean --all -y
}
popd > /dev/null

pushd "$(dirname "$0")/../backend" > /dev/null
echo "[Setup] Installing or updating smartride-backend conda environment..."
conda-lock install --mamba --lockfile conda-lock.yml --name smartride-backend
conda activate smartride-backend
echo "[Setup] smartride-backend conda environment is successfully installed and activated."
popd > /dev/null

# Step 12: Sync Google Drive files
echo "[Setup] Downloading team Google Drive files..."
"$(dirname "$0")/drive.sh" --download

# Step 13: Completed, output the hash of the ps1 equivalent file ($PSScriptRoot/setup.ps1) to last-setup in subscripts/env/parameters/last-setup (may be not existed yet)
version=$(sed -n '4p' $(dirname "$0")/../../setup.ps1 | grep -oP '(?<=\$setupVersion = ")([0-9.]+)(?=")') # get the version number from setup.ps1
last_file="$(dirname "$0")/../parameters/last-setup"
echo "$version" > "$hash_file"

echo "[Setup] SmartRide setup complete. Please check the 'docs' folder for documentation."
echo "[Setup] To run the project, first run './sync-work.sh --pull' and then './run.sh'. Happy coding!"
