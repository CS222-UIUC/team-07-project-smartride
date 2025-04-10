import subprocess
import time
from tqdm import tqdm
import yaml
from pathlib import Path
import sys

class ProgressTracker:
    def __init__(self, total: int, cached_hits: int = 0, desc: str = "Progress"):
        self.total = total
        self.desc = desc
        self.processed = 0
        self.cached_hits = cached_hits
        self.start_time = time.time()
        self.bar = tqdm(
            total=total,
            desc=desc,
            dynamic_ncols=True,
            bar_format="{l_bar}{bar} | {n_fmt}/{total_fmt} {postfix}",
            initial=cached_hits,
            position=1,
        )
        postfix = "[--:--:--<--:--:--, --.--s/it]"
        self.bar.set_postfix_str(postfix)

    def format_time(self, seconds: float) -> str:
        seconds = int(seconds)
        m, s = divmod(seconds, 60)
        h, m = divmod(m, 60)
        return f"{h:02d}:{m:02d}:{s:02d}" if h else f"{m:02d}:{s:02d}"

    def update(self, n=1):
        self.processed += n
        elapsed = time.time() - self.start_time
        remaining_count = self.total - self.cached_hits - self.processed
        rate = elapsed / self.processed if self.processed > 0 else 0
        eta = remaining_count * rate if self.processed > 0 else 0
        postfix = f"[{self.format_time(elapsed)}<{self.format_time(eta)}, {rate:.2f}s/it]"
        self.bar.set_postfix_str(postfix)
        self.bar.update(n)

    def close(self):
        self.bar.close()

def get_name_by_dep(dep: str) -> str:
    return dep.split("==")[0].strip().split("#", 1)[0].strip()

def split_package_sections(csr: str, dep: str) -> list[list[str]]:
    lines = csr.splitlines()
    if not lines:
        return []
    if len(lines) < 2:
        return []
    elif "No match found for:" in lines[1]:
        return []
    sections = []
    dep_name = get_name_by_dep(dep)
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if line and i + 1 < len(lines) and set(lines[i + 1].strip()) == {"-"}:
            pkg_header = lines[i].strip().split()[0].strip()
            if pkg_header == dep_name:
                current = []
                i += 2
                while i < len(lines):
                    # + 2 because the first line is pkg name, the second line is separator
                    if i + 2 < len(lines) and set(lines[i + 2].strip()) == {"-"}:
                        # note that next line is perfectly the next section header
                        break
                    if lines[i].strip():
                        current.append(lines[i].strip())
                    i += 1
                sections.append(current)
        i += 1
    return sections


def get_package_sections(dep: str) -> list[list[str]]:
    stdout = subprocess.PIPE
    stderr = subprocess.DEVNULL
    encoding = "utf-8"
    channel = "conda-forge"
    pkg_name = get_name_by_dep(dep)
    total_packages: list[list[str]] = []
    platforms = ["win-64", "osx-64", "linux-64"]
    platform_bar = tqdm(total=len(platforms), desc=f"{get_name_by_dep(dep)}", position=0, leave=False)
    for platform in platforms:
        search_by_info = subprocess.run(
            ["conda", "search", "--info", pkg_name, "--platform", platform, "-c", channel],
            stdout=stdout,
            stderr=stderr,
            encoding=encoding,
        )
        total_packages += split_package_sections(search_by_info.stdout.strip(), dep)
        platform_bar.update(1)
    platform_bar.set_description_str("")
    platform_bar.close()
    return total_packages


def is_platform_supported(sections: list[list[str]], platform: str) -> bool:
    platform_info = platform.split('-')[0]
    platform_prefix = f"__{platform_info}"
    no_subdir_cnt = 0
    for section in sections:
        subdirs = set([line.split(":", 1)[1].strip().split('-')[0].strip() for line in section if line.strip().startswith("subdir")])
        if not subdirs:
            no_subdir_cnt += 1
            continue
        if platform_info in subdirs:
            return True
        if "noarch" in subdirs:
            # parse dependencies
            deps = []
            collecting = False
            for line in section:
                if line.strip().startswith("dependencies:"):
                    collecting = True
                    continue
                if collecting:
                    if not line.startswith("  - "):
                        break
                    dep_line = line.strip()[2:].strip()
                    deps.append(dep_line.split(" ", 1)[0])
            has_match = any(d == platform_prefix for d in deps)
            has_other = any(d.startswith("__") and d != platform_prefix for d in deps)
            if has_match or not has_other:
                return True
    return False

def load_platform_table(path: Path) -> dict:
    table = {}
    if path.exists():
        for line in path.read_text(encoding="utf-8").splitlines():
            if ":" in line:
                k, v = line.strip().split(":", 1)
                table[k] = v
    return table

def compute_platform_code(has_win: bool, has_osx: bool, has_linux: bool) -> str:
    if has_win and has_osx and has_linux:
        return ""
    if has_win and not has_osx and not has_linux:
        return "win-64"
    if not has_win and has_osx and not has_linux:
        return "osx-64"
    if not has_win and not has_osx and has_linux:
        return "linux-64"
    if has_win and has_osx and not has_linux:
        return "wo-64"
    if has_win and not has_osx and has_linux:
        return "wl-64"
    if not has_win and has_osx and has_linux:
        return "ol-64"
    return "unknown"

def platform_code_to_has_arr(platform_code: str) -> tuple[bool, bool, bool]:
    has_win = platform_code in ["all-64", "win-64", "wo-64", "wl-64"]
    has_osx = platform_code in ["all-64", "osx-64", "wo-64", "ol-64"]
    has_linux = platform_code in ["all-64", "linux-64", "wl-64", "ol-64"]
    return has_win, has_osx, has_linux

def append_platform_entry(path: Path, dep: str, code: str):
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.touch()
    with open(path, "a", encoding="utf-8") as f:
        f.write(f"{get_name_by_dep(dep)}:{code or 'all-64'}\n")

def quiet_write(msg: str, quiet: bool):
    if not quiet:
        tqdm.write(msg)

def print_entry(dep: str, has_win: bool, has_osx: bool, has_linux: bool, is_new: bool, quiet: bool) -> None:
    check       =   "\u2713"
    win_str     =   f"{check if has_win else '':<8}"
    osx_str     =   f"{check if has_osx else '':<8}"
    linux_str   =   f"{check if has_linux else '':<10}"
    line        =   f"{get_name_by_dep(dep):<40}{win_str}{osx_str}{linux_str}"

    if is_new:
        line    =   f"\033[94m{line}\033[0m"

    quiet_write(line, quiet)

def update_new_deps(has_win: bool, has_osx: bool, has_linux: bool, dep: str, new_deps: list) -> tuple[list, bool]:
    found = False
    clean_dep = dep.split("#", 1)[0].strip() # to prevent # [win64] # [win64] # [win64] # [win64] ...
    if has_win and has_osx and has_linux:
        new_deps.append(clean_dep)
        found = True
    else:
        if has_win:
            new_deps.append(f"{clean_dep} # [win]")
            found = True
        if has_osx:
            new_deps.append(f"{clean_dep} # [osx]")
            found = True
        if has_linux:
            new_deps.append(f"{clean_dep} # [linux]")
            found = True
    return new_deps, found

def main():
    args = sys.argv[1:]
    quiet = "--quiet" in args
    cache_output = not ("--no_cache_output" in args)
    args = [arg for arg in args if arg != "--quiet" and arg != "--no_cache_output"]
    if len(args) != 1:
        print("Usage: python path/to/conda_platform_analyzer.py path/to/conda_env.yml [--quiet] [--no_cache_output]")
        sys.exit(1)

    yml_path = Path(args[0])
    current_file = Path(__file__).resolve()
    platform_path = current_file.parent.parent / "parameters" / "conda_platform"
    lock_path = current_file.parent.parent / "parameters" / "processing_conda"

    if lock_path.exists() and lock_path.read_text().strip() == "1":
        print("Another process is analyzing conda environment and/or platform file(s). Aborting.")
        sys.exit(1)
    lock_path.write_text("1")

    try:
        with open(yml_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)

        quiet_write(f"{'Package':<40} {'win-64':<8} {'osx-64':<8} {'linux-64':<10}", quiet)
        quiet_write("-" * 70, quiet)

        deps_list = data.get("dependencies", [])
        platform_table = load_platform_table(platform_path)

        cached_hits = sum(
            1 for dep in deps_list
            if isinstance(dep, str) and get_name_by_dep(dep) in platform_table
        )

        if cached_hits > 0:
            quiet_write(f"Found {cached_hits} cached entries, remaining {len(deps_list) - cached_hits} to process.", quiet)

        total_str_ins_deps = len([i for i in deps_list if isinstance(i, str)])
        total_bar = ProgressTracker(total_str_ins_deps, cached_hits, desc="Processing dependencies")
        new_deps = []

        for dep in deps_list:
            if isinstance(dep, str):
                if get_name_by_dep(dep) in platform_table:
                    platform_code = platform_table[get_name_by_dep(dep)]
                    has_win, has_osx, has_linux = platform_code_to_has_arr(platform_code)
                    if cache_output:
                        print_entry(dep, has_win, has_osx, has_linux, False, quiet)
                    new_deps, _ = update_new_deps(has_win, has_osx, has_linux, dep, new_deps)
                    continue
                sections    = get_package_sections(dep)
                has_win     = is_platform_supported(sections, "win-64")
                has_osx     = is_platform_supported(sections, "osx-64")
                has_linux   = is_platform_supported(sections, "linux-64")
                print_entry(dep, has_win, has_osx, has_linux, True, quiet)
                new_deps, found = update_new_deps(has_win, has_osx, has_linux, dep, new_deps)
                if found:
                    append_platform_entry(platform_path, dep, compute_platform_code(has_win, has_osx, has_linux))
                else:
                    quiet_write(f"[WARN] {get_name_by_dep(dep)} not found on any major platform, skipping.", quiet)
                total_bar.update(1)
        total_bar.close()
        data["dependencies"] = new_deps

        with open(yml_path, "w", encoding="utf-8") as f:
            yaml.dump(data, f, sort_keys=False)

        print(f"\nUpdated .yml and appended new entries to {platform_path}")

    finally:
        lock_path.write_text("0")

if __name__ == "__main__":
    main()
