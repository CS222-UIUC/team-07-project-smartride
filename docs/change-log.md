# Major Change Logs

## Mar 28, Brian

1. Split MapView into multiple modular components (RoutePolyline, WaypointMarkers, UserLocationMarker, etc.) under maps/ for better separation of concerns.

2. Refactored backend structure: moved core server files into backend/server/ instead of directly under backend/.

3. Updated frontend TypeScript files to include explicit type annotations to satisfy strict ESLint rules.

4. Added type annotations to backend Python files in accordance with ruff and mypy static analysis requirements.

5. Added automatic scripts for convenience, in `scripts/` folder, with more instructions at [ci-cd.md](ci-cd.md).
