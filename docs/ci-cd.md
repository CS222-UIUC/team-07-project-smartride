# CI/CD Workflows And Dependency Management

1. You can find all CI workflows in `.github/workflows`.

2. All CI tests **MUST** be passed before merging any branch to `main`.

3. The following workflows are auto triggered for every pull request and for every push to `main` branch.

4. `eslint.yml` automatically runs `ESLint` on frontend code uploading results in SARIF format for GitHub's code scanning. It is also triggered every Saturday.

5. `format-check.yml` checks code formatting on both backend (with `ruff`) and frontend (with `prettier`).

6. `frontend-test.yml` runs frontend unit tests with `Vitest`.

7. `py-type-check.yml` runs `ruff` for linting and `mypy` for type checking on the backend Python code.

8. We do not have any CD procedure yet.

9. Our project uses Dependabot to automate weekly dependency updates for the backend (`pip`), frontend (`npm`), and GitHub Actions workflows. The Dependabot configuration is located in `.github/dependabot.yml`.
