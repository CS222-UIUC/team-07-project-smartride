# SmartRide Script Usage Guide

This document describes the usage of all primary scripts in the `scripts/` directory.

---

## New To Bash / PowerShell Scripts?

1. There are many automatic scripts in the `scripts` folder to make your life easier.

2. If you are a MacOS user, use only `.sh` scripts in your terminal. Before your first use of each of them, run `chmod +x [filename].sh` to grant executable permission to the script `[filename].sh` permanently.

3. If you are a windows user, use `.ps1` scripts in VSCode terminal / Powershell. Before your first time of running script, run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` to grant permission permanently.

4. As a windows user, you can alternatively open `Git Bash` and run `.sh` scripts there. You do not have to run `chmod` as MacOS users do, but if you run into problem, run `chmod`.

5. To run a script, just type in the script name in your terminal, including the `.sh` or `.ps1` file extension. In rare cases, add `./` before the script name.

6. Read the rest of this document for explanation of each script.

## Usage Overview

This part is an overview. For full description, see [Detailed Explanations](#detailed-explanations).

| Situation                            | Script to Use (please first `cd scripts`)   |
|--------------------------------------|---------------------------------------------|
| Launch development app stack         | `run.ps1\|sh --full`                        |
| Launch app stack quicker             | `run.ps1\|sh --easy`                        |
| Run backend checks                   | `backend.ps1\|sh`                           |
| Run frontend checks                  | `frontend.ps1\|sh`                          |
| Verify whole project state quickly   | `auto.ps1\|sh`                              |
| Format code                          | `formatter.ps1\|sh`                         |

---

## Before Submitting a Pull Request

1. You **must** run `backend.ps1|sh` if your changes affect the backend.

2. You **must** run `frontend.ps1|sh` if your changes affect the frontend.

3. You are **strongly encouraged** to run `auto.ps1|sh` to ensure the whole project is clean.

4. After `backend` and `frontend` checks are all clear, you **must** finally run `formatter.ps1|sh` to auto format all codes of our project.

5. Well, it is up to you, but you must not want to spend a lot of time puzzling at why you fail so many CI tests, do you? :)

---

## Detailed Explanation

#### `scripts/run.(ps1|sh)`
Entry point for launching the full SmartRide app stack. You **must** run this script at least once before submitting code changes from backend, since otherwise you will **not** be able to run the `backend` script. You are required to include one of the two run modes below to run this script:

- `--full`
  - Ensures your local conda environment is synced with `conda_env_[platform].yml`.
  - Unlock `easy` mode for future quicker launch of the app stack, until your next change of `conda_env_[platform].yml` and/or push to `main` branch.
  - Then executes the equivalent of `--easy`, see below.

- `--easy`
  - Skips conda sync, you are only able to run with this mode **after** you have successfully run `--full` once after pulling the latest `main`, will be blocked otherwise.
  - Performs `git pull` to fetch latest changes.
  - Opens 3 terminal windows:
    - Backend server
    - Frontend dev server
    - Ngrok tunneling
  - You may not see all 3 windows if you failed to follow [installation.md](installation.md).

#### `scripts/auto.(ps1|sh)`
Runs both frontend and backend workflows:
- Run `eslint`.
- Do unit tests with `vitest`.

Useful for quickly verifying the overall health of the project and if you are lazy enough to run two scripts.

#### `scripts/backend.(ps1|sh)`
Runs the backend workflow, note that you can **only** run this after you have `run` the project at least once. The following workflows will be triggered:
- Do python linting with `ruff`.
- Check python type safety with `mypy`.
- Do unit tests with `Pytest`.
- Sync `conda_env_win.yml` and `conda_env_mac.yml` based on your current conda environment.

This should be clean before any backend-related changes are submitted.

#### `scripts/frontend.(ps1|sh)`
Runs the frontend workflow:
- Lint
- Test

This should be clean before any frontend-related changes are submitted.

#### `scripts/formatter.(ps1|sh)`
Formats both frontend and backend code according to project-wide formatting standards with Ruff (for backend) and Prettier (for frontend).