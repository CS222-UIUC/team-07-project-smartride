import os
import sys
import hashlib

from config import project_root, hash_file_path, file_list_path, committer

# --- SAFEGUARD ---
if os.getenv("_SMARTRIDE_DRIVE_WRAPPER") != "1":
    print("[Error] This script must be called via wrapper script.")
    sys.exit(1)

# --- LOAD FILE LIST ---
with open(file_list_path, "r", encoding="utf-8") as f:
    lines = [line.strip() for line in f if line.strip() and not line.startswith("#")]

entries = []
current_paths = set()
for idx, line in enumerate(lines):
    if "::" not in line:
        continue  # assume already validated
    path_str, owner = [x.strip() for x in line.split("::")]
    if owner == committer:
        full_path = project_root / path_str
        if full_path.exists():
            entries.append((path_str, full_path))
            current_paths.add(path_str)

# --- COMPUTE HASHES ---
new_hashes = {}
for rel_path, full_path in entries:
    with open(full_path, "rb") as f:
        sha = hashlib.sha256(f.read()).hexdigest()
    new_hashes[rel_path] = sha

# --- UPDATE HASH FILE ---
existing_lines = []
if hash_file_path.exists():
    with open(hash_file_path, "r", encoding="utf-8") as f:
        existing_lines = [
            line.strip() for line in f if line.strip() and not line.startswith("#")
        ]

output_lines = []
already_written = set()
for line in existing_lines:
    if "::" not in line:
        continue
    path, old_hash, owner = [x.strip() for x in line.split("::")]

    if owner == committer and path in new_hashes:
        # update
        output_lines.append(f"{path} :: {new_hashes[path]} :: {owner}")
        already_written.add(path)
    else:
        # keep untouched
        output_lines.append(line)

# add new entries if not already written
for path, h in new_hashes.items():
    if path not in already_written:
        output_lines.append(f"{path} :: {h} :: {committer}")

with open(hash_file_path, "w", encoding="utf-8") as f:
    for line in output_lines:
        f.write(line + "\n")

print("[HashFill] Hashes updated for committer:", committer)
