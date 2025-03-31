# Major Change Logs

## Mar 28, Brian

1. Split MapView into multiple modular components (`RoutePolyline`, `WaypointMarkers`, `UserLocationMarker`, etc.) under `maps/` for better separation of concerns.

2. Refactored backend structure: moved core server files into `backend/server/` instead of directly under `backend/`, and use absolute imports throughout the files. For the new structure, python treats `backend` as a proper module. You should now use `cd backend; python -m server.app` instead of `cd backend/server; python app.py`.

3. Add `utils/response` for backend, now please call `api_response` instead of directly call `jsonify` to return message. Add `utils/errors`, with many common errors defined as constants, and registered the error handler globally in `app.py`. For usage, see `auth.py`.

4. Updated frontend TypeScript files to include explicit type annotations to satisfy strict ESLint rules.

5. Added type annotations to backend Python files in accordance with `ruff` and `mypy` static analysis requirements.

6. Added automatic scripts in `scripts/` folder to reduce your memory burden of different commands, with more instructions in [scripts](scripts.md).

7. Add backend unit test github action workflow, see `.github/workflows/backend-test.yml`.

## Mar 31, Brian

1. Automatic scripts refactored. Now the highest-level scripts are `sync-work --(pull|merge)` and `pr-prep`, see [scripts](scripts.md) for more.

2. Create team google drive account. Move `userinfo.db` to google drive. Add environment variables, `.env.shared` and `.env.local`, where `.env.shared` is also moved to drive.

3. Use `rclone` to automatically connect with google drive. Write auto script `drive --(download|upload)` for uploading and downloading, as well as a weak version control tool `drive-file.txt`. See [scripts](scripts.md) and [drive-env](drive-env.md) for details on setting up and usage.

4. Conda operations are now moved to `scripts/subscripts/env`, instead of the previous chaotic call in multiple not-that-relevant scripts.

5. `run` script no longer requires options.

6. Update documentations in `docs` folder.

7. `MapClickHandler` is now an independent map sub-component rather than being in `MapView`.

## What's more

←[Previous: CI/CD](ci-cd.md); ↓[Go back to Documentation](./README.md).
