# team-07-project-smartride

## Backend Configuration Process

1. Clone the repo using the `setup`  branch.

2. Make sure `conda`  is correctly installed

   a. Install `anaconda` or `miniconda` from their official website, and set the following environmental variables (for windows users), `PATH_TO_CONDA` is your directory where `conda` is installed.

   ```
   PATH_TO_CONDA
   PATH_TO_CONDA\Scripts
   PATH_TO_CONDA\Library\mingw-w64\bin
   PATH_TO_CONDA\Library\bin
   ```

   b. Create the virtual environment by running `conda env create -f environment.yml` at `./backend` folder.

   c. Initialize the environment by running `conda init` at `./backend` folder.


3. Running the virtual environment by running `conda activate smartride-backend` at `.\backend` folder

4. Note that there is `(smartride-backend)` before the prompt line. Finally running `python app.py` and visit `127.0.0.1:5000` in the browser.