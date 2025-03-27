# team-07-project-smartride

## Project Configuration

1. Clone the repo by `git clone`, switch to the desired branch.

## Frontend Configuration Process

1. Follow the instructions at `https://pnpm.io/next/installation` to install `pnpm` command.

2. Download and setup `Node.js` from `https://nodejs.org/en/download`.

## Backend Configuration Process

1. Make sure `conda` is correctly installed, version should be at least `23.3.1`.

   a. Install `anaconda` or `miniconda` from their official website, then run `conda init` inside your_conda_location/scripts folder. Then reopen the terminal will give you access to conda.

   b. Create the virtual environment by running `conda env create -f conda_env_win.yml` / `conda env create -f conda_env_mac.yml` (depending on what platform you are using) at `./backend` folder.

   c. Initialize the environment by running `conda init` at `./backend` folder. Then reopen the terminal.

## Open the project

1. In the command line, go to the project folder, then `cd scripts`.

2. If frontend and backend are not configured yet, follow instructions in the previous two paragraphs.

3. Run either `start-dev-win.ps1` or `start-dev-mac.sh`, depending on your platform. It will pop up 4 terminal windows while 3 of them will remain open.

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

1. Currently please always test using chrome, no matter if you are testing on a computer / a phone, we have not used capacitor to transfer this project into a mobile app yet.

2. To test solely on your own computer where you are hosting yourself, just visit `localhost:5173` so that geolocation can be given to the map.

3. To test on a different device, first set up `ngrok` by instruction 4, then follow the following instruction:

   a. Connect the hosting device and the testing device to the same LAN (Local Area Network), preferably by hotspot.

   b. Do NOT use the LAN domain it gives you directly, since you will not be able to use geolocation as banned by browsers for safety reasons.

   c. Run `ngrok http 5173` on the hosting device, and visit the address shown in "Forwarding", like `https://ec0f-96-63-200-99.ngrok-free.app` (it may changes all the time). Don't forget to add `https` at the beginning!

   d. Troubleshoot: If you still cannot see the location in map, then please check permissions for accessing location for chrome in your phone / computer.

4. To set up `ngrok`, follow instructions on `https://ngrok.com/`, the free plan is enough for us.

## Before pushing or pull request to github

1. Run `update-conda-win/mac.ps1/sh` to update conda environments, if you have made any changes to the backend.

2. Make sure you are in the correct branch by `git branch`.

3. Run `git pull`, then `git add -A`, then `git commit -m "commit message"`, then `git push`.

4. You should open pull requests in github website, but before merging PLEASE get all the CI tests passed.

5. After you merged to main, please wait for ESLint to finish and check security tab, there may be MANY bugs that awaits you to fix.
