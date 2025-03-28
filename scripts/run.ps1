# Start three separate windows, one for backend, one for frontend, one for ngrok

# Before running anything, make sure the git is up to date
Start-Process powershell -ArgumentList @"
cd ..
git pull
"@

# Backend, make sure conda is updated before running the flask server
Start-Process powershell -ArgumentList @"
cd ../backend
conda activate smartride-backend
conda env update --file conda_env_win.yml --prune
python -m server.app
"@

# Frontend, make sure the dependencies are updated
Start-Process powershell -ArgumentList @"
cd ../frontend
pnpm install
pnpm run dev
"@

# Ngrok
Start-Process powershell -ArgumentList @"
ngrok http 5173
"@
