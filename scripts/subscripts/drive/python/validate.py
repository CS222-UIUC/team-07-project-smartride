import os
import sys
import hashlib
import subprocess

from config import (
    project_root,
    hash_file_path,
    file_list_path,
    committer,
    rclone_remote,
    rclone_config,
    dot_encode,
)

# --- COLOR ---
RED = "\033[91m"
YELLOW = "\033[93m"
GREEN = "\033[92m"
BLUE = "\033[94m"
RESET = "\033[0m"


def encode_path_for_drive(path_str: str) -> str:
    return path_str.replace(".", dot_encode).replace("/", ".").replace("\\", ".")


def handle_orphaned_self_hash(entries, raw_hash_lines, hash_map):
    """Allow committer to delete their own orphaned hash records (not tracked or reassigned)."""
    path_to_owner = {p: o for p, o in entries}
    tracked_paths = set(p for p, _ in entries)
    updated_lines = []
    removed_count = 0

    for path, hash_val, owner in raw_hash_lines:
        if owner != committer:
            updated_lines.append(f"{path} :: {hash_val} :: {owner}")
            continue

        file_exists = (project_root / path).exists()
        in_list = path in path_to_owner
        current_owner = path_to_owner.get(path)

        reason = []
        allow_remove = False

        if not in_list:
            reason.append("no longer tracked by drive-file.txt")
            allow_remove = True
        elif current_owner != committer:
            reason.append(f"ownership changed to {current_owner}")
            allow_remove = True
        elif not file_exists:
            reason.append("file missing (locally)")
            # Still not eligible unless also orphaned from list or reassigned

        if allow_remove:
            print(
                f"{YELLOW}[Warning] Your hash record for {path} is invalid ({' and '.join(reason)}).{RESET}"
            )
            ans = (
                input(
                    f"{BLUE}Delete your hash entry and your own GDrive file? (y/n, default: n): {RESET}"
                )
                .strip()
                .lower()
            )
            if ans == "y":
                encoded = encode_path_for_drive(path)
                remote_path = f"{rclone_remote}:{committer}/smartride.{encoded}"
                subprocess.run(
                    ["rclone", "delete", remote_path, "--config", rclone_config]
                )
                print(f"[y] Deleted your Google Drive file: {remote_path}{RESET}")
                removed_count += 1
            else:
                print(f"[n] Hash record kept for: {path}{RESET}")
                updated_lines.append(f"{path} :: {hash_val} :: {owner}")
        else:
            updated_lines.append(f"{path} :: {hash_val} :: {owner}")

    if removed_count > 0:
        with open(hash_file_path, "w", encoding="utf-8") as f:
            for line in updated_lines:
                f.write(line + "\n")
        print(
            f"[Clean] Removed {removed_count} of your own invalid hash entries.{RESET}"
        )


# --- SAFEGUARD ---
if os.getenv("_SMARTRIDE_DRIVE_WRAPPER") != "1":
    print(f"{RED}[Error] This script must be called via wrapper script.{RESET}")
    sys.exit(1)

# --- ARGS ---
if len(sys.argv) != 2 or sys.argv[1] not in ("--local", "--sync", "--format"):
    print(f"{RED}Usage: validate.py --local | --sync | --format{RESET}")
    sys.exit(1)
MODE = sys.argv[1]

# --- READ FILE LIST ---
with open(file_list_path, "r", encoding="utf-8") as f:
    lines = [line.strip() for line in f if line.strip() and not line.startswith("#")]

entries = []
for idx, line in enumerate(lines):
    if "::" not in line:
        print(f"{RED}[Error] Invalid format at line {idx + 1}: {line}{RESET}")
        sys.exit(1)
    path_str, owner = [x.strip() for x in line.split("::")]
    entries.append((path_str, owner))

# --- --format mode ---
if MODE == "--format":
    print(f"{GREEN}[Validate] Formats are all correct.{RESET}")
    sys.exit(0)

# --- --local mode ---
if MODE == "--local":
    print(
        f"{BLUE}[Validate] Checking required files exist for current committer...{RESET}"
    )
    for rel_path, owner in entries:
        if owner == committer:
            if not (project_root / rel_path).exists():
                print(f"{RED}[Error] File missing: {rel_path}{RESET}")
                sys.exit(1)
    print(f"{GREEN}[Validate] Local files present.{RESET}")
    sys.exit(0)

# --- --sync mode ---
print(f"{BLUE}[Validate] Checking sync hash match for all files...{RESET}")
if not hash_file_path.exists():
    print(f"{RED}[Error] Hash file missing.{RESET}")
    sys.exit(1)

with open(hash_file_path, "r", encoding="utf-8") as f:
    hash_lines = [
        line.strip() for line in f if line.strip() and not line.startswith("#")
    ]

hash_map = {}
hash_owners = {}
raw_hash_lines = []

for idx, line in enumerate(hash_lines):
    if "::" not in line:
        print(f"{RED}[Error] Invalid hash format at line {idx + 1}: {line}{RESET}")
        sys.exit(1)
    path, hash_val, owner = [x.strip() for x in line.split("::")]
    raw_hash_lines.append((path, hash_val, owner))
    hash_map[(path, owner)] = hash_val
    if path not in hash_owners:
        hash_owners[path] = set()
    hash_owners[path].add(owner)

# --- Hash correctness check ---
for rel_path, owner in entries:
    key = (rel_path, owner)
    full_path = project_root / rel_path
    if not full_path.exists():
        print(f"{RED}[Error] File missing: {rel_path} (owned by {owner}){RESET}")
        sys.exit(1)
    if key not in hash_map:
        print(f"{RED}[Error] No hash recorded for {rel_path} (owned by {owner}){RESET}")
        sys.exit(1)
    with open(full_path, "rb") as f:
        real_hash = hashlib.sha256(f.read()).hexdigest()
    if real_hash != hash_map[key]:
        print(f"{RED}[Error] Hash mismatch: {rel_path} (owned by {owner}){RESET}")
        sys.exit(1)

# --- Multiple owners warning (everyone sees) ---
for path, owners in hash_owners.items():
    if len(owners) > 1:
        sorted_owners = ", ".join(sorted(owners))
        print(
            f"{YELLOW}[Warning] Multiple hash owners for {path}: {sorted_owners}{RESET}"
        )

# --- Own invalid entries cleanup ---
handle_orphaned_self_hash(entries, raw_hash_lines, hash_map)

print(f"{GREEN}[Validate] All files synced and hash matched.{RESET}")
