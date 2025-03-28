# team-07-project-smartride

## Project Configuration

1. Clone the repo by `git clone https://github.com/CS222-UIUC/team-07-project-smartride.git`.

2. You should always create a new branch for developing by `git checkout -b [branch_name]`. Do **NOT** work directly in the `main` branch!

## Pre-configuration of Libraries

1. Follow the instructions at `https://pnpm.io/next/installation` to install `pnpm` command.

2. Download and setup `Node.js` from `https://nodejs.org/en/download`.

3. Make sure `conda` is correctly installed, version should be at least `23.3.1`.

   a. Install `anaconda` or `miniconda` from their official website, then run `conda init` inside your_conda_location/scripts folder. Then reopen the terminal will give you access to conda.

   b. Create the virtual environment by running `conda env create -f conda_env_win.yml` / `conda env create -f conda_env_mac.yml` (depending on what platform you are using) at `./backend` folder.

   c. Initialize the environment by running `conda init` at `./backend` folder. Then reopen the terminal.

4. Set up `ngrok` by following the instructions on `https://ngrok.com/`, the free plan is enough for us.

## Automatic Scripts

1. There are many automatic scripts in `scripts` folder to make your life easier.

2. If you are a MacOS user, use only `.sh` scripts in your terminal. Before using them, run `chmod +x [filename].sh` to grant permission.

3. If you are a windows user, use `.ps1` scripts in VSCode terminal / Powershell. If it is your first time to run script, run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` to grant permission.

4. As a windows user, you can alternatively open `Git Bash` and run `.sh` scripts there. You do not have to run `chmod` as MacOS users do, but if you run into problem, run `chmod`.

5. To run a script, just type in the script name in your terminal, including the `.sh` or `.ps1` file extension. In rare cases, add `./` before the script name.

6. Read the rest of this document for explanation of each script.

## Open the project

1. In the command line, go to the project folder, then `cd scripts`.

2. If frontend and backend are not configured yet, follow instructions in the previous two paragraphs.

3. Run the `start-dev` script. It will pop up 4 terminal windows while 3 of them will remain open.

4. To kill the project, run `ctrl+c` on all popped-up terminals. Then safely close those terminal windows.

## User authentication

1. In the virtual environment, run the following command, line by line. Note there is a `;` at the end of the 3rd line.

   ```
   sqlite3
   .open userinfo.db
   SELECT * from user;
   ```

2. If working correctly, following content should display

   ```
   1|Alice|alice@example.com|pbkdf2:sha256:<hash-here>
   2|Boyang|boyangl3@illinois.edu|pbkdf2:sha256:<hash-here>
   3|Brian|pg22@illinois.edu|pbkdf2:sha256:<hash-here>

   ```

3. To exit the `sqlite3` environment, run `.exit`.

## Test on multi-platforms

1. Please always test using Chrome, regardless of whether you are on a computer or a phone. We have not converted this project into a mobile app using `Capacitor` yet.

2. To test locally on the same machine that is hosting the app, visit `http://localhost:5173`. This will allow geolocation to work correctly.

3. To test on a different device, follow the following instructions:

   a. Connect both the hosting and testing devices to the same LAN (e.g., via hotspot).

   b. Do NOT use the LAN IP address directly, as modern browsers block geolocation on non-HTTPS origins for security reasons.

   c. Run `ngrok http 5173` on the hosting device, and visit the address shown in "Forwarding", like `https://ec0f-96-63-200-99.ngrok-free.app` (it may changes all the time). Be sure to use `https://`!

   d. Troubleshoot: If the map still doesn't show your location, check the location permissions for Chrome on your device.

## Before pushing or pull request to github

1. Run the `update-conda` script to update conda environments, if you have made any changes to the backend.

2. Make sure you are in the correct branch by `git branch`.

3. Merge both the new updates for your branch and for main branch via:

   ```
   git pull
   git fetch origin
   git merge origin/main
   ```

4. Run the `formatter` script to auto-format your code. The CI test will check on this, so please format beforehand to save your time.

5. If you are developing backend, also run the `py-type-check` script to do python type checks and fix any type bugs. It is also mandatory.

6. Now follow the standard Git workflow:

   ```
   git add -A
   git commit -m "your commit message"
   git push
   ```

7. Note that if you are working on a new branch that hasen't being pushed before, run `git push --set-upstream origin [branch_name]` instead of `git push`.

8. Open a Pull Request on GitHub. Before merging, **PLEASE** get all the CI tests passed.

9. After merging into `main`, please wait for ESLint to finish and check security tab, there may be _MANY_ bugs that awaits you, please fix them promptly, **including** warnings.

## Some Useful Git Operations

1. Sometimes you may want to check all branches from origin. Run `git fetch --all`. Then you can view all remote branches by `git branch -r`.

2. To switch to a remote branch, first run `git checkout [remote_branch]`, this `[remote_branch]` should likely be `origin/xxx`, remember to include `origin/`.

3. To make edits in this remote branch, run `git switch -c [branch_name]`. Say the remote branch name is `origin/example`, then you should run `git switch -c example` to auto track `example` with `origin/example`.

4. Now you can normally use git operations on this local branch.

5. `git fetch -p` will delete all remotely deleted, but locally visible via `git branch -r` branches. Your local branch should still be manually deleted by `git branch -D [local_branch]`.
