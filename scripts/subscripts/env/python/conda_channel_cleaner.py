import sys
import yaml
from collections import OrderedDict
from yaml.representer import SafeRepresenter


def channel_cleaner(output_path: str) -> None:
    yaml.add_representer(OrderedDict, SafeRepresenter.represent_dict)
    with open(output_path, "r", encoding="utf-8") as f:
        env_data = yaml.safe_load(f)

    name = env_data.get("name", "environment")
    dependencies = env_data.get("dependencies", [])

    ordered_env = OrderedDict()
    ordered_env["name"] = name
    ordered_env["channels"] = ["conda-forge"]
    ordered_env["dependencies"] = dependencies

    with open(output_path, "w", encoding="utf-8") as f:
        yaml.safe_dump(dict(ordered_env), f, sort_keys=False)

    print("[Channel Cleaner] Cleaned conda channels, set to conda-forge.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python path/to/conda_channel_cleaner.py path/to/conda_env.yml")
        sys.exit(1)
    channel_cleaner(sys.argv[1])
