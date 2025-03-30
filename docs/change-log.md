# Major Change Logs

## Mar 28, Brian

1. Split MapView into multiple modular components (`RoutePolyline`, `WaypointMarkers`, `UserLocationMarker`, etc.) under `maps/` for better separation of concerns.

2. Refactored backend structure: moved core server files into `backend/server/` instead of directly under `backend/`, and use absolute imports throughout the files. For the new structure, python treats `backend` as a proper module. You should now use `cd backend; python -m server.app` instead of `cd backend/server; python app.py`.

3. Add `utils/response` for backend, now please call `api_response` instead of directly call `jsonify` to return message. Add `utils/errors`, with many common errors defined as constants, and registered the error handler globally in `app.py`. For usage, see `auth.py`.

4. Updated frontend TypeScript files to include explicit type annotations to satisfy strict ESLint rules.

5. Added type annotations to backend Python files in accordance with ruff and mypy static analysis requirements.

6. Added automatic scripts for convenience, in `scripts/` folder, with more instructions in [usage.md](usage.md). For example, if you are not curious about what are changed, just run `run.ps1/sh` to launch the whole project.

7. Add backend unit test github action workflow, see `.github/workflows/backend-test.yml`.

## What's more
←[Previous: CI/CD](ci-cd.md); ↓[Go back to Documentation](./README.md).