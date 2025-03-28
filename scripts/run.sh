#!/bin/bash

# Start three separate windows, one for backend, one for frontend, one for ngrok

# Before running anything, make sure the git is up to date
osascript <<EOF
tell application "Terminal"
    do script "cd .. && git pull"
end tell
EOF

# Backend, make sure conda is updated before running the flask server
cd ../backend
conda activate smartride-backend

CURRENT_DIR=$(pwd)

UNAME_OUT="$(uname -s)"
if [[ "$UNAME_OUT" == "Darwin" ]]; then
    echo "Launching Flask backend on macOS..."
    osascript <<EOF
tell application "Terminal"
    do script "cd $CURRENT_DIR && conda env update --file conda_env_mac.yml --prune && python -m server.app"
end tell
EOF

elif [[ "$UNAME_OUT" == "Linux" ]]; then
    echo "Detected Linux: launching Flask backend..."
    conda env update --file conda_env_mac.yml --prune
    python -m server.app

elif [[ "$UNAME_OUT" == MINGW* || "$UNAME_OUT" == MSYS* || "$UNAME_OUT" == CYGWIN* ]]; then
    echo "Detected Windows: launching Flask backend..."
    conda env update --file conda_env_win.yml --prune
    python -m server.app

else
    echo "Unknown OS: $UNAME_OUT"
fi



# Frontend, make sure the dependencies are updated
osascript <<EOF
tell application "Terminal"
    do script "cd ../frontend && pnpm install && pnpm run dev"
end tell
EOF

# Ngrok
osascript <<EOF
tell application "Terminal"
    do script "ngrok http 5173"
end tell
EOF
