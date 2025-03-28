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

UNAME_OUT="$(uname -s)"

if [[ "$UNAME_OUT" == "Darwin" ]]; then
    echo "Launching Flask backend on macOS..."

    osascript <<EOF
tell application "Terminal"
    do script "cd $(pwd) && conda activate smartride-backend && conda env update --file conda_env_mac.yml --prune && python app.py"
end tell
EOF

elif [[ "$UNAME_OUT" == "Linux" ]]; then
    echo "Detected Linux: launching Flask backend here."
    conda activate smartride-backend
    conda env update --file conda_env_mac.yml --prune
    python app.py

elif [[ "$UNAME_OUT" == MINGW* || "$UNAME_OUT" == MSYS* || "$UNAME_OUT" == CYGWIN* ]]; then
    echo "Detected Windows: launching Flask backend in Windows terminal..."
    conda activate smartride-backend
    conda env update --file conda_env_win.yml --prune
    python app.py

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
