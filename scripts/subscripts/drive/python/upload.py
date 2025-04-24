import os
import sys
import subprocess

from config import (
    project_root,
    file_list_path,
    upload_only_drive_file_path,
    committer,
    rclone_remote,
    rclone_config,
    dot_encode,
)


def gen_cmd(full_path, remote_path):
    return [
        "rclone",
        "copyto",
        str(full_path),
        remote_path,
        "--config",
        rclone_config,
        "--drive-pacer-min-sleep",
        "500ms",
        "--drive-chunk-size",
        "8M",
    ]


def encode_path_for_drive(path_str: str) -> str:
    return path_str.replace(".", dot_encode).replace("/", ".").replace("\\", ".")


# --- SAFEGUARD ---
if os.getenv("_SMARTRIDE_DRIVE_WRAPPER") != "1":
    print("[Error] This script must be called via wrapper script.")
    sys.exit(1)

# --- STEP: Read list and prepare upload targets ---
print("[Upload] Scanning files to upload...")
with open(file_list_path, "r", encoding="utf-8") as f:
    lines = [line.strip() for line in f if line.strip() and not line.startswith("#")]

to_upload = []
for line in lines:
    if "::" not in line:
        continue
    path_str, file_owner = [x.strip() for x in line.split("::")]
    if file_owner == committer:
        full_path = project_root / path_str
        if full_path.exists():
            to_upload.append((path_str, full_path))

"""
# upload also special files in upload-only-drive-file.txt
# format:
<relative path of the file to be uploaded>                          ::      <file owner>    ::      <root dir in drive>     ::      <file name in drive>
frontend/android/app/build/outputs/apk/debug/app-debug.apk          ::      ETwilight       ::      APK                     ::      app-debug.apk
frontend/ios/build/Release-iphoneos/app.ipa                         ::      ETwilight       ::      IPA                     ::      app.ipa
# each line should be uploaded to <root dir in drive>/<file owner>/<file name in drive> and only triggers the upload if the file owner is the committer
"""

print("[Upload] Scanning special files to upload...")
with open(upload_only_drive_file_path, "r", encoding="utf-8") as f:
    lines = [line.strip() for line in f if line.strip() and not line.startswith("#")]

special_to_upload = []
for line in lines:
    # check if enough "::" are present
    if line.count("::") != 3:
        continue
    path_str, file_owner, root_dir, file_name = [
        x.strip() for x in line.split("::")
    ]
    if file_owner == committer:
        full_path = project_root / path_str
        if full_path.exists():
            special_to_upload.append((path_str, full_path, root_dir, file_name))


# --- STEP: Upload ---
print("[Upload] Uploading files to SmartRide team Google Drive...")
for rel_path, full_path in to_upload:
    encoded_name = encode_path_for_drive(rel_path)
    remote_path = f"{rclone_remote}:{committer}/smartride.{encoded_name}"
    result = subprocess.run(
        gen_cmd(full_path, remote_path), capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"[Error] Failed to upload {rel_path}:\n{result.stderr}")
        sys.exit(1)
    else:
        print(f"[OK] Uploaded {rel_path} → {remote_path}")

print("[Upload] Uploading special files to SmartRide team Google Drive...")
for rel_path, full_path, root_dir, file_name in special_to_upload:
    remote_path = f"{rclone_remote}:{root_dir}/{committer}/{file_name}"
    result = subprocess.run(
        gen_cmd(full_path, remote_path), capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"[Error] Failed to upload {rel_path}:\n{result.stderr}")
        sys.exit(1)
    else:
        print(f"[OK] Uploaded {rel_path} → {remote_path}")

print("[Upload] Upload complete.")
