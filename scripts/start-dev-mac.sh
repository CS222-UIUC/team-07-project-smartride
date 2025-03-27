#!/bin/bash

# Start three separate windows, one for backend, one for frontend, one for ngrok

# Before running anything, make sure the git is up to date
osascript <<EOF
tell application "Terminal"
    do script "cd .. && git pull"
end tell
EOF

# Backend, make sure conda is updated before running the flask server
osascript <<EOF
tell application "Terminal"
    do script "cd ../backend && conda activate smartride-backend && conda env update --file conda_env_mac.yml --prune && python app.py"
end tell
EOF

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
