# SmartRide Script Usage Guide

This document describes the usage of all primary scripts in the `scripts/` directory.

---

## New To Bash / PowerShell Scripts?

1. There are many automatic scripts in the `scripts` folder to make your life easier.

2. If you are a MacOS user, use only `.sh` scripts in your terminal. Before your first use of each of them, run `chmod +x [filename].sh` to grant executable permission to the script `[filename].sh` permanently.

3. If you are a windows user, use `.ps1` scripts in VSCode terminal / Powershell. Before your first time of running script, run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` to grant permission permanently.

4. We do not officially support Linux by now, but you can generally follow same procedure as MacOS user.

5. To run a script, just type in the script name in your terminal, including the `.sh` or `.ps1` file extension. If it does not work, add `./` before the script name.

6. Do not run internal scripts under the `scripts/subscripts/` folder directly. These are invoked by the top-level scripts listed below and are not meant to be used on their own.

7. Read the rest of this document for explanation of each script.

## Usage Overview

This part is an overview. For full description, see [Detailed Explanations](#detailed-explanations).

| Situation                                                                   | Script to Use (please first `cd scripts`)       |
| --------------------------------------------------------------------------- | ----------------------------------------------- |
| New to the project, or there are major change to environments               | `setup.ps1\|sh`                                 |
| Being instructed to run a specific step `step_xxx` in setup script          | `setup.ps1\|sh --step_xxx`                      |
| Just begins a new development cycle, need to sync code and files            | `sync-work.ps1\|sh --pull`                      |
| Working in a separate branch, need to merge code and files from main branch | `sync-work.ps1\|sh --merge`                     |
| Finish developing, need to wrap up and prepare for pull request             | `pr-prep.ps1\|sh`                               |
| Launch development app stack                                                | `run.ps1\|sh (--dev)`                           |
| Launch android / ios / web app stack in production setting                  | `run.ps1\|sh --android \| --ios \| --web`       |
| Run backend and frontend checks                                             | `check.ps1\|sh (--fullstack)`                   |
| Run backend checks                                                          | `check.ps1\|sh --backend`                       |
| Run frontend checks                                                         | `check.ps1\|sh --frontend`                      |
| Format code                                                                 | `formatter.ps1\|sh`                             |
| Upload files in `drive-file.txt` to team google drive                       | `drive.ps1\|sh --upload`                        |
| Download files in `drive-file.txt` from team google drive                   | `drive.ps1\|sh --download`                      |
| Import conda environment from lock file                                     | `conda-op.ps1\|sh --import`                     |
| Install new packages and export to yml file                                 | `conda-op.ps1\|sh --install <pkg_name> [--pip]` |
| Lock the conda environment and update lock file                             | `conda-op.ps1\|sh --lock`                       |

---

## A complete development cycle

1. If you are new to the project, run `setup.ps1|sh` to set up your environment.

2. If you have no idea what to do for a complete development cycle, from syncing new code to submitting pull request, follow the instructions below.

3. To begin with, run `sync-work.ps1|sh --pull`. If it blocks you, run `setup.ps1|sh` first, since it signals that there are major changes to the environment.

4. To add new conda/pip packages, run `conda-op.ps1|sh --install <pkg_name>`. Normally do NOT run with `--pip` option unless the previous script fails. Also, NEVER runs `conda install xxx` or `pip install xxx` manually.

5. If no issues appear, open a new branch, and start adding new features to the code. To run the project, run `run.ps1|sh`.

6. After you think you are ready to prepare for a new pull request, follow the following procedures.

   - You are recommended to first run `sync-work.ps1|sh --merge`. Resolve all merge conflicts and rerun until no issues occured.
   - Check out the detailed introductions of `sync-work --merge` below to see when you should **NOT** run this script before `pr-prep`.
   - You must run `pr-prep.ps1|sh`. Resolve all issues and rerun until no issues occured.

7. Submit a pull request now! Wait for all CI tests pass, and a review from somebody else, now you can merge your efforts into main branch!

8. Well, it is up to you, but you definitely does not want to spend a lot of time puzzling at why you fail so many CI tests, do you? ;)

---

## Detailed Explanation

#### `scripts/setup.(ps1|sh)`

This script is used to set up your local environment. Other than the following situations, you do not have to run this script, since it will take a while to finish.
Situations where you DO have to run this script:

- You are new to the project.
- You are blocked during `sync-work`, `run` or `pr-prep` scripts, and are asked one or more times to run `setup` with `--step_xxx`, listed below.

You have two options:

1. Run `./setup.ps1\|sh` without any option. This will trigger all the steps below in order.
2. Run `./setup.ps1\|sh --step_xxx` where available `step_xxx` are listed below, like `step_drive`. This will trigger only `step_xxx` setup process.

This script will guide you through the following steps:

1. `step_rclone`: Set up or update `rclone/rclone.conf`, `.env.local`, `.env.shared`. You still need to manually fill out the `token` entry in `rclone.conf` since it contains sensitive information to our team.
2. `step_env`: Set up or update `.env.local`, `.env.shared` and `.env.auto`. If you have set up `user.name` as github config before, the `COMMITTER` entry in `.env.local` will be automatically filled out.
3. `step_cli`: Depending on your platform, it performs the following:

- For window users, it installs `rclone` CLI, `node.js` and `miniconda3` commands in `libaries` folder of this project, and `pnpm` command somewhere else (since we directly run the install script that `pnpm.io` recommends). The processes will be skipped if you have already installed them, and you can choose to abort the script and manually install them.
- For MacOS users, it installs `rclone` CLI, `node.js`, `pnpm` and `miniconda3` commands into your home or `/usr/local/bin` folder. The processes will be skipped if you have already installed them, and you can choose to abort the script and manually install them. Still, for MacOS users, installing themselves are no different from running this script, so it is recommended to run this script.
- For both platforms, if any download or installation occurs, you will be required to restart your TERMINAL (NOT script itself). There are additional instructions if MacOS users install `miniconda3`, see the script output.

4. `step_conda`: It will automatically create a new conda environment `smartride-backend` based on `yml` files in `backend/` folder. It will then install `mamba` and `conda_lock` in `conda-forge` that greatly accelerates the future environment update process.
5. `step_drive`: It will finally download all sensitive files from team google drive, your `.env.shared` and database files will be automatically synced.
6. Now, you are able to run `sync-work` and `run` scripts. Happy coding!

#### `scripts/sync-work.(ps1|sh)`

Sync newest updates from github, import all missing conda dependencies, and download team google drive files. Note that you can **only** execute this script if your `setup` is up to date. You must include one of the following parameters which functionalities are only different in the sync GitHub step:

- `--pull`, this will checkout to `main` branch and pull all updates.

- `--merge`, this will fetch all updates from `origin`, and try to merge `origin/main` into your current branch.

**IMPORTANT**: You should **NOT** run `sync-work.(ps1|sh)` with **either** option in the following scenarios:

1. DON'T run if your local `drive-file.txt` is not updated yet while you have modified many files which are tracked in there.

- Why? These files are likely **not** tracked by GitHub and you will lose their updates.
- What to do? Update `drive-file.txt` and run `pr-prep.(ps1|sh)`, or at least `drive.(ps1|sh) --upload` to sync your files to google drive. Alternatively, backup them. Now you may run `sync-work`.

2. Better DON'T run if you have `pip install`ed any new packages.

- Why? We are using `mamba` to manage conda dependencies, although _significantly_ faster in updating environment, it will pop up a prompt to ask you whether you want to remove any packages not in the `yml` file.
- What to do? Run `pr-prep.(ps1|sh)` first. Now you may run `sync-work`.

#### `scripts/run.(ps1|sh)`

Entry point for launching the full SmartRide app stack. Note that you can **only** execute this script after you have `sync-work` after you merged/pull changes from the `main` branch and `setup` to required minimum versions. This `run` script will open the following 2 subprocesses.

- Backend server
- Frontend server

It is worth discussing the frontend server. There are a few options available to the `run` script:

- `--dev`: This opens the frontend server in `localhost:VITE_DEV_PORT` where `VITE_DEV_PORT` is a variable in `.env.local`.
- `--web`: This builds the production version, and opens a preview frontend server in `VITE_WLAN_IP:4173` where `VITE_WLAN_IP` is a variable in `.env.auto`.
- `--android` | `--ios`: This builds the production version, and triggers capacitor to sync the targeted platform, and does the following:
  - If `VITE_DEPLOY_TARGET` in `.env.local` is `MACHINE`, it does nothing else.
  - If `VITE_DEPLOY_TARGET` is `EMULATOR`, AND if `SMARTRIDE_EMULATOR_MODE` in `.env.local` is `OPEN`, it launches Android Studio / XCode for you to debug the code for the targeted platform.
  - If `VITE_DEPLOY_TARGET` is `MACHINE`, AND if `SMARTRIDE_EMULATOR_MODE` in `.env.local` is `RUN`, it launches the emulator for targeted platform directly.

Note that you may ONLY run with `--android` given you are using Windows (with Android Studio and Latest JDK installed). You may ONLY run with `--ios` given you are using MacOS (with XCode installed).
You may not see every window if you failed to follow [installation.md](installation.md).

#### `scripts/pr-prep.(ps1|sh)`

Run checks and lints, auto formatter, lock conda dependencies, and upload team google drive files. Note that you can **only** execute this script if your `setup` is up to date. You are strongly recommended to run `sync-work` first EXCEPT for the conditions mentioned in that section.

New: `pr-prep` is NO LONGER exporting all conda dependencies for you! Run `conda-op` with `--install <pkg_name>` option instead for all packages you are trying to install and export. See `conda-op` script below.

#### `scripts/formatter.(ps1|sh)`

Formats both frontend and backend code according to project-wide formatting standards with Ruff (for backend) and Prettier (for frontend).

#### `scripts/check.(ps1|sh)`

Performs verification checks before submitting backend or frontend changes by running code check / lint workflows. Here are available parameters:

- `--backend`, this will run backend checks. Note that you can **only** execute this script after you have `sync-work` at least once. The following workflows will be triggered:

  - Do python linting with `ruff`.
  - Check python type safety with `mypy`.
  - Do unit tests with `Pytest`.

- `--frontend`, this will run frontend checks. The following workflows will be triggered:

  - Run `eslint`.
  - Do unit tests with `vitest`.

- `--fullstack`, default condition if you give no parameters, this will run both frontend and backend checks, with same executing requirements as `--backend`.

#### `scripts/drive.(ps1|sh)`

It completes uploading and downloading operations to and from our team google drive. See [drive-env.md](drive-env.md), if you do not know what this drive is for or have not set up `rclone` config, as well as for instructions on how to edit `drive-file.txt` and `.gitignore`. You must include one of the following parameters to run this script:

- `--upload`, this will trigger the following workflows, attempting to upload the files specified in `drive-file.txt`.

  - Validate whether `drive-file.txt` is in the correct format, and whether all files in there exist locally in the correct folder.
  - Upload all files specified to team google drive by `rclone`.
  - Validate whether all files are correctly synced between local and drive.
  - Trigger cleaning process which users can choose to delete outdated files.

- `--download`, this will trigger the following workflows, attempting to download the files specified in `drive-file.txt`.

  - Validate whether `drive-file.txt` is in the correct format.
  - Try to download all files specified from team google drive by `rclone`.
  - Validate whether all files are correctly synced between local and drive.
  - Trigger cleaning process which users can choose to delete outdated files.

#### `scripts/conda-op.(ps1|sh)`

It contains all the `conda` workflows you may encounter. You must include one of the following parameters to run this script:

- `--import`, this will update your current `smartride-backend` environment with `conda-lock.yml` located in `project_dir/backend` folder.

- `--lock`, this will generate a multi-platform lock based on `conda-env.yml` located in `project_dir/backend` folder. Do NOT modify `conda-env.yml` by hand!

- `--install <pkg_name> [--pip]`, this will try to install `<pkg_name>` (for example, `flask`) package for you using `conda-forge` as the channel. You should almost never run with `--pip` option unless the package you are trying to install is a type stub like `types-request` that is only managed by `pip`.

## What's more

←[Previous: Usage](usage.md); ↓[Go back to Documentation](./README.md); [Next: Architecture](architecture.md)→
