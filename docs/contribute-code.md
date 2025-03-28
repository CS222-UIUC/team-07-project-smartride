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

13. **_The following are some useful git operations._**

14. Sometimes you may want to check all branches from origin. Run `git fetch --all`. Then you can view all remote branches by `git branch -r`.

15. To switch to a remote branch, first run `git checkout [remote_branch]`, this `[remote_branch]` should likely be `origin/xxx`, remember to include `origin/`.

16. To make edits in this remote branch, run `git switch -c [branch_name]`. Say the remote branch name is `origin/example`, then you should run `git switch -c example` to auto track `example` with `origin/example`.

17. Now you can normally use git operations on this local branch.

18. `git fetch -p` will delete all remotely deleted, but locally visible via `git branch -r` branches. Your local branch should still be manually deleted by `git branch -D [local_branch]`.
