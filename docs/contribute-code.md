# Contribute Code To This Project

1. Since this is currently a school project, only CS222 team-07 members can contribute to this repo.

2. Sensitive tokens and keys will only be shared within the team. Still, if you are the 1) mentor, 2) TA or professor of CS222, 3) have a solid reason for why you want the tokens, write an email to `smartride207@gmail.com`.

3. See [installation.md](installation.md) if you are not a team member but want to run the project.

4. You should always create a new branch for developing by `git checkout -b [branch_name]`. Do **NOT** work directly in the `main` branch!

5. Make sure you are in the correct branch by `git branch`.

6. Follow [scripts.md](scripts.md), section "A complete development cycle" for instructions on what to do before developing, during developing, and after developing but before PR.

7. Note that if you are working on a new branch that hasen't being pushed before, run `git push --set-upstream origin [branch_name]` instead of `git push`.

8. Open a Pull Request on GitHub. Before merging, **PLEASE** get all the CI tests passed.

9. After merging into `main`, if any ESLint Code scanning issues popped up in github security tab, please fix them promptly, **including** warnings.

10. **Important**: If your code has any architectural refactoring / updates, you **MUST** explicitly mention them in `docs/change-log.md` before your PR. Still, it is recommended that you maintain this log for any non-minor updates.

11. **_The following are some useful git operations._** (Update: By the brand-new shell and powershell techniques, you can now throw git into rubbish bin!)

12. Sometimes you may want to check all branches from origin. Run `git fetch --all` and then `git branch -r` to view all remote branches.

13. To switch to a remote branch, run `git checkout [remote_branch]`, this `[remote_branch]` should likely be `origin/xxx`, remember to include `origin/`.

14. To make edits in this remote branch, run `git switch -c [branch_name]`. Say the remote branch name is `origin/example`, then you should run `git switch -c example` to auto track `example` with `origin/example`.

15. Now you can normally use git operations on this local branch.

16. `git fetch -p` will delete all remotely deleted while locally still visible branches when you run `git branch -r`.

17. Delete any local branch by `git branch -D [local_branch]`.

## What's more

←[Previous: Architecture](architecture.md); ↓[Go back to Documentation](./README.md); [Next: CI/CD](ci-cd.md)→
