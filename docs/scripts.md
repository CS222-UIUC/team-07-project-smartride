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

| Situation                       | Script to Use (please first `cd scripts`) |
| ------------------------------- | ----------------------------------------- |
| Launch development app stack    | `run.ps1\|sh --full`                      |
| Launch app stack quicker        | `run.ps1\|sh --easy`                      |
| Run backend and frontend checks | `check.ps1\|sh --fullstack`               |
| Run backend checks              | `check.ps1\|sh --backend`                 |
| Run frontend checks             | `check.ps1\|sh --frontend`                |
| Format code                     | `formatter.ps1\|sh`                       |

---

## Before Submitting a Pull Request

1. To summarize, run `auto.ps1|sh` and resolve all reported issues. Repeat the cycle — run `auto`, fix issues, and rerun — until everything passes.

2. Well, it is up to you, but you definitely does not want to spend a lot of time puzzling at why you fail so many CI tests, do you? ;)

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

Runs both `check` and `formatter` scripts. Highly recommend to only use this script and the `run` script throughout the time.

#### `scripts/formatter.(ps1|sh)`

Formats both frontend and backend code according to project-wide formatting standards with Ruff (for backend) and Prettier (for frontend).

#### `scripts/check.(ps1|sh)`

Performs verification checks before submitting backend or frontend changes by running code check / lint workflows. Here are available parameters:

- `--backend`, this will run backend checks. Note that you can **only** execute this script after you have `run` the project at least once. The following workflows will be triggered:

  - Do python linting with `ruff`.
  - Check python type safety with `mypy`.
  - Do unit tests with `Pytest`.
  - Sync `conda_env_win.yml` and `conda_env_mac.yml` based on your current conda environment.

- `--frontend`, this will run frontend checks. The following workflows will be triggered:

  - Run `eslint`.
  - Do unit tests with `vitest`.

- `--fullstack`, default condition if you give no parameters, this will run both frontend and backend checks, with same executing requirements as `--backend`.

## What's more

←[Previous: Usage](usage.md); ↓[Go back to Documentation](./README.md); [Next: Architecture](architecture.md)→
