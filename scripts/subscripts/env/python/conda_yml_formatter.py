import re
import yaml
import sys
from pathlib import Path
from collections import OrderedDict


class IndentDumper(yaml.Dumper):
    def increase_indent(self, flow=False, indentless=False):
        return super().increase_indent(flow, False)


def smart_str_representer(dumper, data):
    return dumper.represent_scalar("tag:yaml.org,2002:str", data, style=None)


def format_conda_yml(yml_path: Path):
    with open(yml_path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)

    # prefix is useless
    data.pop("prefix", None)

    raw_deps = data.get("dependencies", [])
    conda_deps = []
    pip_deps = []

    for dep in raw_deps:
        if isinstance(dep, str):
            conda_deps.append(dep)
        elif isinstance(dep, dict) and "pip" in dep:
            pip_deps.extend(dep["pip"])

    conda_deps = sorted(conda_deps, key=lambda x: x.lower())
    pip_deps = sorted(pip_deps, key=lambda x: x.lower())

    dependencies = conda_deps

    # if no pip_deps, then no need to add pip: [] in dependencies
    if pip_deps:
        dependencies.append({"pip": pip_deps})

    ordered_data = OrderedDict()
    for key in ["name", "channels", "dependencies"]:
        if key in data:
            ordered_data[key] = data[key] if key != "dependencies" else dependencies

    # I want to make dumper add a double quote " instead of single quote ' for those with selectors, like: incorrect: ucrt==10.0.22621.0=h57928b3_1 # [win64] or 'ucrt==10.0.22621.0=h57928b3_1 # [win64]', correct: "ucrt==10.0.22621.0=h57928b3_1 # [win64]"
    # However, for dependencies:, name:, etc., NO QUOTE AT ALL. "dependencies": is incorrect.
    # As well, for those dependencies without selector, NO QUOTE AT ALL.
    IndentDumper.add_representer(str, smart_str_representer)

    formatted_yaml = yaml.dump(
        dict(ordered_data),
        sort_keys=False,
        indent=2,
        width=1000,
        allow_unicode=True,
        Dumper=IndentDumper,
        default_flow_style=False,
    )

    with open(yml_path, "w", encoding="utf-8") as f:
        f.write(formatted_yaml)

    print(f"[Conda Formatter] Formatted conda environment yml file successfully.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(
            "[Conda Formatter] Usage: python path/to/conda_yml_formatter.py path/to/conda_env.yml"
        )
        sys.exit(1)

    format_conda_yml(Path(sys.argv[1]))
