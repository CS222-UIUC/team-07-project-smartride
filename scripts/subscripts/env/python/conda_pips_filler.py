import yaml
import subprocess
import sys
from pathlib import Path


def get_pip_installed():
    result = subprocess.run(
        ["pip", "list", "--format=freeze"], stdout=subprocess.PIPE, encoding="utf-8"
    )
    lines = result.stdout.strip().splitlines()
    pkgs = []
    for line in lines:
        if "==" in line:
            name, version = line.split("==", 1)
            if name.startswith("types-") or name in {"black", "pre-commit"}:
                pkgs.append(name)
    return pkgs


def update_yml(yml_path: Path, pip_packages, output_path: Path):
    with open(yml_path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)

    found = False
    for dep in data["dependencies"]:
        if isinstance(dep, dict) and "pip" in dep:
            dep["pip"] = sorted(set(dep["pip"]) | set(pip_packages))
            found = True
            break

    if not found:
        data["dependencies"].append({"pip": sorted(pip_packages)})

    with open(output_path, "w", encoding="utf-8") as f:
        yaml.dump(data, f, sort_keys=False)

    print(f"[Pips Filler]: Filled pip packages. Found {len(pip_packages)} packages.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(
            "[Pips Filler] Usage: python path/to/conda_pips_filler.py path/to/conda_env.yml"
        )
        sys.exit(1)

    pip_pkgs = get_pip_installed()
    update_yml(Path(sys.argv[1]), pip_pkgs, Path(sys.argv[1]))
