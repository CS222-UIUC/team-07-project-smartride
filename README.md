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

2. Running the virtual environment by running `conda activate smartride-backend` at `.\backend` folder, and after that you shold expect to see `(smartride-backend)` before the prompt line.

3. Run `python app.py` and visit `127.0.0.1:5000` in the browser to see the main database for backend with flask.

4. In a separate cmd/powershell, first repeat step 2, then run `python route_service.py` and visit `127.0.0.1:13116` in the browser to see the route_service server with FastAPI and Uvicorn. Alternatively to using `python`, you may run `uvicorn route_service:app --reload --host 127.0.0.1 --port 13116` for same effect.

5. For either process, use `ctrl+c` to kill the process.
