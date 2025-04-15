#!/bin/bash
set -euo pipefail

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
        platform="$(uname -s)"
        if [[ "$platform" == "Linux" ]]; then
          wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh
        elif [[ "$platform" == "Darwin" ]]; then
          curl https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh -o ~/miniconda3/miniconda.sh
        else
          echo "[Miniconda] Unsupported platform: $platform"
          exit 1
        fi
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
  exit 1
fi

exit 0