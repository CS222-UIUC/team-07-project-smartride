# team-07-project-smartride

## Table of Contents

- [Introduction](#introduction)
- [Tech Stack](#tech-stack)
- [Documentation](#documentation)
- [External Resources and License Notices](#external-resources-and-license-notices)

## Introduction

**SmartRide** is a smart cycling app that integrates route planning, turn-by-turn navigating, health tracking, and intelligent ride suggestions. It is designed with a robust backend, a dynamic frontend, and rich features tailored to every cyclist's needs.

<h3>Completed Features</h3>
<ul>
  <li>
    <strong>Full User Authentication System</strong>
    <br>
    Secure login, registration, and session management with Flask and JWT.
  </li>
  <li>
    <strong>Frontend & Backend Architecture</strong>
    <br>
    React + TypeScript frontend with Flask/FastAPI backend, modular and maintainable.
  </li>
  <li>
    <strong>Route Planning via OpenRouteService</strong>
    <br>
    Backend integration with ORS API for route generation, using real-time parameters.
  </li>
  <li>
    <strong>Frontend Route Visualization</strong>
    <br>
    Interactive cycling route planning and visualization on OpenStreetMap via Leaflet.
  </li>
</ul>

<h3>Features Coming Soon</h3>
<ul>
  <li>
    <strong>Smart Route Recommendations</strong>
    <br>
    Personalized route suggestions based on:
    <ul>
      <li>Weather (especially wind direction)</li>
      <li>Terrain preferences (e.g., hill avoidance/seeking)</li>
      <li>Calorie goals and physical condition</li>
    </ul>
  </li>
  <li>
    <strong>Ride Tracking & Analytics</strong>
    <br>
    Detailed ride logs including:
    <ul>
      <li>Real-time path taken</li>
      <li>Wind and elevation history</li>
      <li>Energy expenditure analysis</li>
    </ul>
  </li>
  <li>
    <strong>Health Assistant</strong>
    <br>
    Health data tracking and progress monitoring:
    <ul>
      <li>Daily/weekly goals</li>
      <li>Trend visualization</li>
      <li>Actionable insights for fitness improvement</li>
    </ul>
  </li>
  <li>
    <strong>Real-Time Navigation & Rerouting</strong>
    <br>
    Live map navigation with support for dynamic rerouting during the ride.
  </li>
</ul>

<h3>Future Plans</h3>
<ul>
  <li>
    <strong>Community System</strong>
    <br>
    User-driven community features such as:
    <ul>
      <li>Route sharing</li>
      <li>Group challenges</li>
      <li>Social ride planning</li>
    </ul>
  </li>
</ul>

## Tech Stack

### Frontend

- React with TypeScript
- Vite for development and build
- Tailwind CSS for styling
- React Router for navigation
- React Leaflet + OpenStreetMap for map rendering
- ORSM (OpenRouteService Map, for turn-by-turn navigation, planned)
- Capacitor (planned) for mobile deployment

### Backend

- Flask (main server)
  - Flask-Login for session management
  - Flask-SQLAlchemy for database models
  - Flask-CORS for cross-origin access
- FastAPI (route service)
  - Integrated with OpenRouteService (ORS) API
- SQLite (development database)
  - Planned migration to PostgreSQL with Docker support

### DevOps & Tooling

- GitHub Actions for CI/CD and testing
- Conda for Python environment management
- pnpm for frontend dependency management
- Docker (planned) for deployment and backend upgrades

## Documentation

### Contents

- [Project Pre-Configuration](#project-pre-configuration)
- [Automatic Scripts](#automatic-scripts)
- [Run the Project](#run-the-project)
- [User Authentication](#user-authentication)
- [Contribute Code To This Project](#contribute-code-to-this-project)
- [CI/CD Workflow](#cicd-workflow)

### Project Pre-Configuration

1. Clone the repo by `git clone https://github.com/CS222-UIUC/team-07-project-smartride.git`.

2. Follow the instructions at `https://pnpm.io/next/installation` to install `pnpm` command.

3. Download and setup `Node.js` from `https://nodejs.org/en/download`.

4. Make sure `conda` is correctly installed, version should be at least `23.3.1`.

   a. Install `anaconda` or `miniconda` from their official website, then run `conda init` inside your_conda_location/scripts folder. Then reopen the terminal will give you access to conda.

   b. Create the virtual environment by running `conda env create -f conda_env_win.yml` / `conda env create -f conda_env_mac.yml` (depending on what platform you are using) at `./backend` folder.

   c. Initialize the environment by running `conda init` at `./backend` folder. Then reopen the terminal.

5. Set up `ngrok` by following the instructions on `https://ngrok.com/`, the free plan is enough for us.

### Automatic Scripts

1. There are many automatic scripts in `scripts` folder to make your life easier.

2. If you are a MacOS user, use only `.sh` scripts in your terminal. Before using them, run `chmod +x [filename].sh` to grant permission.

3. If you are a windows user, use `.ps1` scripts in VSCode terminal / Powershell. If it is your first time to run script, run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` to grant permission.

4. As a windows user, you can alternatively open `Git Bash` and run `.sh` scripts there. You do not have to run `chmod` as MacOS users do, but if you run into problem, run `chmod`.

5. To run a script, just type in the script name in your terminal, including the `.sh` or `.ps1` file extension. In rare cases, add `./` before the script name.

6. Read the rest of this document for explanation of each script.

### Run The Project

1. In the command line, go to the project folder, then `cd scripts`.

2. If frontend and backend are not configured yet, follow instructions in the previous two paragraphs.

3. Run the `start-dev` script. It will pop up 4 terminal windows while 3 of them will remain open.

4. Please always test the frontend using Chrome, regardless of whether you are on a computer or a phone. We have not converted this project into a mobile app using `Capacitor` yet.

5. To test locally on the same machine that is hosting the app, visit `http://localhost:5173`. This will allow geolocation to work correctly.

6. To test on a different device, follow the following instructions:

   a. Connect both the hosting and testing devices to the same LAN (e.g., via hotspot).

   b. Do NOT use the LAN IP address directly, as modern browsers block geolocation on non-HTTPS origins for security reasons.

   c. Run `ngrok http 5173` on the hosting device, and visit the address shown in "Forwarding", like `https://ec0f-96-63-200-99.ngrok-free.app` (it may changes all the time). Be sure to use `https://`!

   d. Troubleshoot: If the map still doesn't show your location, check the location permissions for Chrome on your device.

7. To kill the project, run `ctrl+c` on all popped-up terminals. Then safely close those terminal windows.

### User Authentication

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

### Contribute Code To This Project

1. Since this is currently a school project, only CS222 team 7 members can contribute to this repo.

2. You should always create a new branch for developing by `git checkout -b [branch_name]`. Do **NOT** work directly in the `main` branch!

3. Run the `update-conda` script to update conda environments, if you have made any changes to the backend.

4. Make sure you are in the correct branch by `git branch`.

5. Merge both the new updates for your branch and for main branch via:

   ```
   git pull
   git fetch origin
   git merge origin/main
   ```

6. Run the `formatter` script to auto-format your code. The CI test will check on this, so please format beforehand to save your time.

7. If you are developing backend, also run the `py-type-check` script to do python type checks and fix any type bugs. It is also mandatory.

8. For more explanations on our CI/CD procedures, read the next section.

9. Now follow the standard Git workflow:

   ```
   git add -A
   git commit -m "your commit message"
   git push
   ```

10. Note that if you are working on a new branch that hasen't being pushed before, run `git push --set-upstream origin [branch_name]` instead of `git push`.

11. Open a Pull Request on GitHub. Before merging, **PLEASE** get all the CI tests passed.

12. After merging into `main`, please wait for ESLint to finish and check security tab, there may be _MANY_ bugs that awaits you, please fix them promptly, **including** warnings.

13. **_The following are some useful git operations._**

14. Sometimes you may want to check all branches from origin. Run `git fetch --all`. Then you can view all remote branches by `git branch -r`.

15. To switch to a remote branch, first run `git checkout [remote_branch]`, this `[remote_branch]` should likely be `origin/xxx`, remember to include `origin/`.

16. To make edits in this remote branch, run `git switch -c [branch_name]`. Say the remote branch name is `origin/example`, then you should run `git switch -c example` to auto track `example` with `origin/example`.

17. Now you can normally use git operations on this local branch.

18. `git fetch -p` will delete all remotely deleted, but locally visible via `git branch -r` branches. Your local branch should still be manually deleted by `git branch -D [local_branch]`.

### CI/CD Workflows

1. You can find all CI workflows in `.github/workflows`.

2. All CI tests **MUST** be passed before merging any branch to `main`.

3. `dependabot.yml` automates weekly dependency updates for the backend (`pip`), frontend (`npm`), and GitHub Actions workflows.

4. The following workflows are auto triggered for every pull request and for every push to `main` branch.

5. `eslint.yml` automatically runs `ESLint` on frontend code uploading results in SARIF format for GitHub's code scanning. It is also triggered every Saturday.

6. `format-check.yml` checks code formatting on both backend (with `ruff`) and frontend (with `prettier`).

7. `frontend-test.yml` runs frontend unit tests with `Vitest`.

8. `py-type-check.yml` runs `ruff` for linting and `mypy` for type checking on the backend Python code.

9. We do not have any CD procedure yet.

## External Resources and License Notices

1. Colored map markers in `frontend/public/markers` are from [Leaflet Color Markers](https://github.com/pointhi/leaflet-color-markers) by pointhi, licensed under the MIT License.

2. The animation and relevant pictures

   ```
   frontend/src/assets/cycle_anim.gif
   frontend/src/assets/cycle_last_frame.png
   frontend/src/assets/cycle_logo.png
   frontend/src/assets/cycle_trp.png
   frontend/public/cycle_logo
   ```

   are all based on a GIF from [Gifer](https://gifer.com/en/H3SO), with custom editing. This asset is used for demonstration only and may be subject to third-party copyright.  
   We do **not** claim ownership or redistribution rights. See [Gifer Terms of Service](https://gifer.com/en/p/tos) for details.
