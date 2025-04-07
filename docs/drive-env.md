# Smartride Team Google Drive and Environment Variables

## What is it for?

Files like database files, .env.shared are not suitable for uploading to GitHub. They either should be securely kept or are not useful parts of version control. However, for big projects like this, it is sometimes important to share these files within group members, while slack or WeChat are too inofficial. We therefore used `rclone` and auto scripts to help teammates easily sync these files.

## Instructions to setup

### Rclone

- `rclone` can backup and restore files to and from cloud storages, where in our case, google drive.

- We have a team email account which is used to sync `rclone`. As a teammate, you do not have to sync `rclone` yourself. All entries except for the token are filled for you in `rclone/rclone.conf.example`. Just copy that into `rclone/rclone.conf` by

  ```
  cd rclone
  cp rclone.conf.example rclone.conf
  ```

- Now, contact ETwilight for the token value and fill in.

### Environment Variables

- `.env.local` and `.env.shared` stores all the environment variables we need. Generate them by copying from relevant `.example` files:

  ```
  cp .env.local.example .env.local
  cp .env.shared.example .env.shared
  ```

- Modify `COMMITTER` variable in `.env.local` to be your GitHub account.

- Now, run `cd scripts;drive.(ps1|sh) --download` to sync `.env.shared` and other team files. Check out [scripts.md](scripts.md) if you do not know how to run a script.

## How to use

- First, google drive does **not** has version-control. Our version-control is relying on `drive-file.txt`, located in the root, and a hidden `drive-file.hash` which are both synced to GitHub.

- If you made some changes to `drive-file.txt` according to instructions below, and you wish to upload, run `drive.(ps1|sh) --upload` to sync to google drive.

- After doing so, all teammates may run `drive.(ps1|sh) --download` to sync to local.

- Here is an example `drive-file.txt`.

  ```
  alice/test/alice-track.example.txt  ::      Alice
  .env.shared                         ::      ETwilight
  ```

- With this example `drive-file.txt`, we are telling google drive that we want to track `.env.shared` and `backend/database/userinfo.db`.

- If committer `Alice` wants to track a new file `alice-track2.example.txt` located in `alice/test/`, they add a new line and write `alice/test/alice-track2.example.txt :: Alice`. Feel free to add tabs to align. They **must** make sure that this file is correctly located under the specified folder.

- If committer `Bob` modifies `alice-track.example.txt` while not changing its directory, they changes committer `Alice` to `Bob` so the first line becomes `alice/test/alice-track.example.txt :: Bob`. AFter Bob uploads, warning will be issued to all teammates upon syncing. However, Alice's file will remain on the drive unless Alice themselves download from drive and chooses to delete it when prompted.

- If `Alice` wants to keep their outdated work, do **NOT** modify the committer back to Alice **without** getting their original work back. This will cause Alice's drive backup to be overwritten by Bob's.

- **NEVER** delete any line in `drive-file.txt` if you aren't the committer. If you think other committers should clear their outdated file, tell them and ask them to do so.

## When to use

- If you have already finished your first download from google drive, you will find `.env.shared`. This is a highly secured file that contain tokens, service config values, or other team-wide non-public variables. Never should be uploaded to GitHub directly.
- Similarly, you will find `userinfo.db`. These database files can be large, and can vary accross developers during development phase without impacting common works. Google Drive creates a backup for common versions, and for each one's versions that they can select on their own.
- For example, if in the future there is a neural network model that you don't want to leak to public, use google drive!
- **Important: Whenever you add a new file to drive-file.txt, you are waiving the right to use Git version control. Add that file to `.gitignore` immediately!**

## What's more

←[Previous: Installation](installation.md); ↓[Go back to Documentation](./README.md); [Next: Usage](usage.md)→

```

```
