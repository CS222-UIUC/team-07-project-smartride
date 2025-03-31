#!/bin/bash
set -e

if [[ "$1" != "--upload" && "$1" != "--download" ]]; then
  echo "Usage: drive.sh --upload | --download"
  exit 1
fi

export _SMARTRIDE_DRIVE_WRAPPER=1
cd "$(dirname "$0")/../"

if [ "$1" = "--download" ]; then
  echo "[download] Validating control file formats..."
  python3 scripts/subscripts/drive/python/validate.py --format

  echo "[download] Downloading secret files from SmartRide team Google Drive..."
  python3 scripts/subscripts/drive/python/download.py

  echo "[download] Validating sync status..."
  python3 scripts/subscripts/drive/python/validate.py --sync

  echo "[download] Job finished. Local files tracked by drive-file.txt are all synced with google drive."

elif [ "$1" = "--upload" ]; then
  echo "[upload] Validating local file structure..."
  python3 scripts/subscripts/drive/python/validate.py --local

  echo "[upload] Hashing owned files..."
  python3 scripts/subscripts/drive/python/hashfill.py

  echo "[upload] Uploading files to SmartRide team Google Drive..."
  python3 scripts/subscripts/drive/python/upload.py

  echo "[upload] Validating sync status..."
  python3 scripts/subscripts/drive/python/validate.py --sync

  echo "[upload] Job finished. Local files tracked by drive-file.txt are all synced with google drive."
fi
