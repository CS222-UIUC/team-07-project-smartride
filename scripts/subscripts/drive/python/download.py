import os
import sys
import subprocess

from config import (
    project_root,
    file_list_path,
    rclone_remote,
    rclone_config,
    dot_encode,
)


def encode_path_for_drive(path_str: str) -> str:
    return path_str.replace(".", dot_encode).replace("/", ".").replace("\\", ".")


# --- SAFEGUARD ---
if os.getenv("_SMARTRIDE_DRIVE_WRAPPER") != "1":
    print("[Error] This script must be called via wrapper script.")
    sys.exit(1)

# --- STEP: Read list and prepare download targets ---
print("[Download] Scanning files to download...")
with open(file_list_path, "r", encoding="utf-8") as f:
    lines = [line.strip() for line in f if line.strip() and not line.startswith("#")]

to_download = []
for line in lines:
    if "::" not in line:
        continue
    path_str, file_owner = [x.strip() for x in line.split("::")]
    encoded_name = encode_path_for_drive(path_str)
    remote_path = f"{rclone_remote}:{file_owner}/smartride.{encoded_name}"
    full_path = project_root / path_str
    to_download.append((remote_path, full_path))

# --- STEP: Download via rclone ---
print("[Download] Downloading files from SmartRide team Google Drive...")
for remote_path, local_path in to_download:
    local_path.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        "rclone",
        "copyto",
        remote_path,
        str(local_path),
        "--config",
        rclone_config,
        "--drive-pacer-min-sleep",
        "500ms",
        "--drive-chunk-size",
        "8M",
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"[Error] Failed to download {remote_path}:\n{result.stderr}")
        sys.exit(1)
    else:
        print(f"[OK] Downloaded {remote_path} → {local_path}")

print("[Download] Download complete.")
