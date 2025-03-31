import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# --- Load env
load_dotenv(".env.shared")
load_dotenv(".env.local", override=True)


# --- Project paths
drive_root = Path(__file__).resolve().parents[1]
project_root = drive_root.parents[2]
hash_file_path = drive_root / "file" / "drive-file.hash"
file_list_path = project_root / "drive-file.txt"

# --- Env values
committer = os.getenv("COMMITTER")
rclone_remote = os.getenv("RCLONE_REMOTE", "smartride")
rclone_config = os.getenv("RCLONE_CONFIG", "rclone/rclone.conf")

# --- Special Character
dot_encode = "_-_-sMaRtRiDeDoT-_-_"

# --- Validation
if not committer:
    print("[Error] COMMITTER is not set in .env")
    sys.exit(1)
