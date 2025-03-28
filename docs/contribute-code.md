# Contribute Code To This Project

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

13. **Important**: If your code has any architectural refactoring / updates, you **MUST** explicitly mention them in `docs/change-log.md` before your PR. Still, it is recommended that you maintain this log for any non-minor updates.

14. **_The following are some useful git operations._**

15. Sometimes you may want to check all branches from origin. Run `git fetch --all` and then `git branch -r` to view all remote branches.

16. To switch to a remote branch, run `git checkout [remote_branch]`, this `[remote_branch]` should likely be `origin/xxx`, remember to include `origin/`.

17. To make edits in this remote branch, run `git switch -c [branch_name]`. Say the remote branch name is `origin/example`, then you should run `git switch -c example` to auto track `example` with `origin/example`.

18. Now you can normally use git operations on this local branch.

19. `git fetch -p` will delete all remotely deleted while locally still visible branches when you run `git branch -r`.

20. Delete any local branch by `git branch -D [local_branch]`.

## Go back to README

[Go back to README](./README.md)
