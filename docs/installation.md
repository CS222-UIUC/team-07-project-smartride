# Installation Guide

1. Clone the repo by `git clone https://github.com/CS222-UIUC/team-07-project-smartride.git`.

2. The simplest way to set up the environment is to run:

   ```cd scripts
   chmod +x ./setup.sh && ./setup.sh   # for MacOS
   ./setup.ps1                         # for Windows
   ```

   In the first step, you will need to contact ETwilight for the `token` of `rclone.conf` to fill in. Check out [drive-env.md](drive-env.md) for more details.

3. Install `pnpm`, `node.js`, `conda` (either `anaconda` or `miniconda`), and `rclone` on your machine if you choose to set up manually.

4. Set up `ngrok` by following the instructions on `https://ngrok.com/`, the free plan is enough for us. It is not mandatory at this time if you only want to give this project a try.

5. Note for non-teammates only:

- The project is still runnable, but you should follow instructions below.
- Register your own ORS API key and put it into `ORS_API_KEY` entry of `.env.shared`.
- Design your own `FLASK_SECRET_KEY` and `JWT_SECRET_KEY` and put into `.env.shared`, they do not have to be the same as ours.
- Comment out certain lines in certain files as indicated (This doc is not synced in real-time, so you may need to figure out yourselves):
  - `scripts/setup.ps1`: line 23-71, 319-322
  - `scripts/setup.sh`: line 4-34, 194-195
  - `scripts/sync-work.ps1`: line 9-10, 59-65
  - `scripts/sync-work.sh`: line 9, 41-42
  - `scripts/pr-prep.ps1`: line 7-8, 40-46
  - `scripts/pr-prep.sh`: line 6, 39-44
- Run `setup` and `setup -admin`.
- Now follow [usage.md](usage.md) to run the project. This is no different from the teammates' instructions.

6. To request for `rclone.conf` token or other sensitive files, or if you have a strong passion of contributing code, read [contribute-code.md](contribute-code.md) for more details. A simple message is that we rarely share sensitive informations.

## What's more

↓[Go back to Documentation](./README.md); [Next: Team Google Drive and Environment Variables](drive-env.md)→
