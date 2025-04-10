import yaml
from pathlib import Path
import sys

def update_new_deps(dep: str, new_deps: list) -> list:
    dep_name = dep.split("==")[0].strip()
    dep_name = dep_name.split("#", 1)[0].strip()
    if dep_name not in new_deps:
        new_deps.append(dep_name)
    return new_deps

def main():
    args = sys.argv[1:]
    if len(args) != 1:
        print("Usage: python path/to/conda_depvr_remover.py path/to/conda_env.yml")
        sys.exit(1)

    yml_path = Path(args[0])
    current_file = Path(__file__).resolve()
    lock_path = current_file.parent.parent / "parameters" / "processing_conda"

    if lock_path.exists() and lock_path.read_text().strip() == "1":
        print("Another process is analyzing conda environment and/or platform file(s). Aborting.")
        sys.exit(1)
    lock_path.write_text("1")

    try:
        with open(yml_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
        deps_list = data.get("dependencies", [])
        new_deps = []
        for dep in deps_list:
            if isinstance(dep, str):
                new_deps = update_new_deps(dep, new_deps)
        data["dependencies"] = new_deps
        with open(yml_path, "w", encoding="utf-8") as f:
            yaml.dump(data, f, sort_keys=False)
        print(f"[Dep-Version Remover] Removed version info from conda environment yml file successfully.")

    finally:
        lock_path.write_text("0")

if __name__ == "__main__":
    main()
