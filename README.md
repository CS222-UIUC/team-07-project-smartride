# team-07-project-smartride

## Project Configuration

1. Clone the repo by `git clone`, switch to the desired branch.

## Frontend Configuration Process

1. Follow the instructions at `https://pnpm.io/next/installation` to install `pnpm` command.

2. Download and setup `Node.js` from `https://nodejs.org/en/download`.

3. `cd frontend`, run first `pnpm install` then `pnpm run dev`.

4. If successful, there will be a website ip address shown in the command line, which you should be able to see the frontend website upon opening.

5. Use `ctrl+c` in the command line to kill the process.

## Backend Configuration Process

1. Make sure `conda` is correctly installed, version should be at least `23.3.1`.

   a. Install `anaconda` or `miniconda` from their official website, and set the following environmental variables (for windows users), `PATH_TO_CONDA` is your directory where `conda` is installed.

   ```
   PATH_TO_CONDA
   PATH_TO_CONDA\Scripts
   PATH_TO_CONDA\Library\mingw-w64\bin
   PATH_TO_CONDA\Library\bin
   ```

   b. Create the virtual environment by running `conda env create -f environment_win.yml` / `conda env create -f environment_mac.yml` (depending on what platform you are using) at `./backend` folder.

   c. Initialize the environment by running `conda init` at `./backend` folder.

2. Running the virtual environment by running `conda activate smartride-backend` at `.\backend` folder

3. Note that there is `(smartride-backend)` before the prompt line. Finally running `python app.py` and visit `127.0.0.1:5000` in the browser.

4. Use `ctrl+c` to kill the process.

## [Update] User authentication

1. Make sure have `flask-login` installed. If not, run the following command in the virtual environment.

   ```
   pip install flask-login
   ```

   

2. In the virtual environment, run the following command, line by line. Note there is a `;` at the end of the 3rd line.

   ```
   sqlite3
   .open userinfo.db
   SELECT * from user;
   ```

3. If working correctly, following content should display

   ```
   1|Alice|alice@example.com|pbkdf2:sha256:<hash-here>
   2|Boyang|boyangl3@illinois.edu|pbkdf2:sha256:<hash-here>
   3|Brian|pg22@illinois.edu|pbkdf2:sha256:<hash-here>
   
   ```

4. To exit the `sqlite3` environment, run `.exit`.
