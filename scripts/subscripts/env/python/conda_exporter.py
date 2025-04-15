from pathlib import Path
import sys

def export_package(env_path: str, package_name: str):
    env_file = Path(env_path)

    if not env_file.exists():
        print("[Conda Exporter] Error: conda-env.yml not found.")
        sys.exit(1)

    lines = env_file.read_text(encoding="utf-8").splitlines()

    if any(package_name in line for line in lines):
        print(f"[Conda Exporter] Package '{package_name}' already exists in conda-env.yml. No changes made.")
        return

    try:
        idx = next(i for i, line in enumerate(lines) if line.strip() == "dependencies:") + 1
        lines.insert(idx, f"  - {package_name}")
        env_file.write_text("\n".join(lines) + "\n", encoding="utf-8")
        print(f"[Conda Exporter] Package '{package_name}' appended to conda-env.yml.")
    except StopIteration:
        print("[Conda Exporter] 'dependencies:' section not found. Aborted.")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python path/to/conda_Conda Exporter.py path/to/conda_env.yml <package_name>")
        sys.exit(1)

    export_package(sys.argv[1], sys.argv[2])
