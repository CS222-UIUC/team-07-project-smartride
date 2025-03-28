### 👋 Welcome to CS222-Team-07 Repo for Smartride Project.

<h1>SmartRide</h1>
<p><em>Smart Cycling App for Smarter Riders</em></p>
<p>
  <img src="https://raw.githubusercontent.com/CS222-UIUC/team-07-project-smartride/main/frontend/src/assets/cycle_logo.png" alt="SmartRide Logo" width="100"/>
</p>

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.en.html) [![Repo Size](https://img.shields.io/github/repo-size/CS222-UIUC/team-07-project-smartride)](https://github.com/CS222-UIUC/team-07-project-smartride) [![Dependabot](https://img.shields.io/badge/dependabot-enabled-blue.svg)](https://docs.github.com/code-security/dependabot)

[![ESLint](https://github.com/CS222-UIUC/team-07-project-smartride/actions/workflows/eslint.yml/badge.svg)](https://github.com/CS222-UIUC/team-07-project-smartride/actions/workflows/eslint.yml) [![Format Check](https://github.com/CS222-UIUC/team-07-project-smartride/actions/workflows/format-check.yml/badge.svg)](https://github.com/CS222-UIUC/team-07-project-smartride/actions/workflows/format-check.yml) [![Frontend Test](https://github.com/CS222-UIUC/team-07-project-smartride/actions/workflows/frontend-test.yml/badge.svg)](https://github.com/CS222-UIUC/team-07-project-smartride/actions/workflows/frontend-test.yml) [![Python Lint](https://github.com/CS222-UIUC/team-07-project-smartride/actions/workflows/py-type-check.yml/badge.svg)](https://github.com/CS222-UIUC/team-07-project-smartride/actions/workflows/py-type-check.yml)

## Table of Contents

- [Introduction](#introduction)
- [External Resources and License Notices](#external-resources-and-license-notices)
- [Documentation](#documentation)
- [Tech Stack](#tech-stack)

---

## Introduction

We are CS222 team-07, developer team of **SmartRide**, which is a smart cycling app that integrates route planning, turn-by-turn navigating, health tracking, and intelligent ride suggestions. It is designed with a robust backend, a dynamic frontend, and rich features tailored to every cyclist's needs.

**Developers:**

<p>
  <img src="https://raw.githubusercontent.com/CS222-UIUC/team-07-project-smartride/refs/heads/main/developers.png" alt="Developers" width="600"/>
</p>

<h3>Completed Features</h3>
<ul>
  <li>
    <strong>Full User Authentication System</strong>
    <br>
    Secure login, registration, and session management with Flask and JWT.
  </li>
  <li>
    <strong>Frontend & Backend Architecture</strong>
    <br>
    React + TypeScript frontend with Flask/FastAPI backend, modular and maintainable.
  </li>
  <li>
    <strong>Route Planning via OpenRouteService</strong>
    <br>
    Backend integration with ORS API for route generation, using real-time parameters.
  </li>
  <li>
    <strong>Frontend Route Visualization</strong>
    <br>
    Interactive cycling route planning and visualization on OpenStreetMap via Leaflet.
  </li>
</ul>

<h3>Features Coming Soon</h3>
<ul>
  <li>
    <strong>Smart Route Recommendations</strong>
    <br>
    Personalized route suggestions based on:
    <ul>
      <li>Weather (especially wind direction)</li>
      <li>Terrain preferences (e.g., hill avoidance/seeking)</li>
      <li>Calorie goals and physical condition</li>
    </ul>
  </li>
  <li>
    <strong>Ride Tracking & Analytics</strong>
    <br>
    Detailed ride logs including:
    <ul>
      <li>Real-time path taken</li>
      <li>Wind and elevation history</li>
      <li>Energy expenditure analysis</li>
    </ul>
  </li>
  <li>
    <strong>Health Assistant</strong>
    <br>
    Health data tracking and progress monitoring:
    <ul>
      <li>Daily/weekly goals</li>
      <li>Trend visualization</li>
      <li>Actionable insights for fitness improvement</li>
    </ul>
  </li>
  <li>
    <strong>Real-Time Navigation & Rerouting</strong>
    <br>
    Live map navigation with support for dynamic rerouting during the ride.
  </li>
</ul>

<h3>Future Plans</h3>
<ul>
  <li>
    <strong>Community System</strong>
    <br>
    User-driven community features such as:
    <ul>
      <li>Route sharing</li>
      <li>Group challenges</li>
      <li>Social ride planning</li>
    </ul>
  </li>
</ul>

---

## External Resources and License Notices

1. This project is licensed under a customized GPL v3 license.

   - You may use, study, modify, and share the source code for **non-commercial** purposes.
   - **Commercial use by third parties is strictly prohibited.** Only the original authors (CS222 Team 07) retain the right to use the software for commercial purposes.
   - See [LICENSE](./LICENSE) for details.

2. Colored map markers in `frontend/public/markers` are from [Leaflet Color Markers](https://github.com/pointhi/leaflet-color-markers) by pointhi, licensed under the MIT License.
3. The animation and relevant pictures

   ```
   frontend/src/assets/cycle_anim.gif
   frontend/src/assets/cycle_last_frame.png
   frontend/src/assets/cycle_logo.png
   frontend/src/assets/cycle_trp.png
   frontend/public/cycle_logo
   ```

   are all based on a GIF from [Gifer](https://gifer.com/en/H3SO), with custom editing. This asset is used for demonstration only and may be subject to third-party copyright.
   We do **not** claim ownership or redistribution rights. See [Gifer Terms of Service](https://gifer.com/en/p/tos) for details.

---

## Documentation

For detailed documentation, please refer to the [docs folder](./docs/README.md).

---

## Tech Stack

### Frontend

- React + Typescript + Vite
- Tailwind CSS for styling
- React Leaflet + OpenStreetMap for map rendering
- ORSM (OpenRouteService Map, for turn-by-turn navigation, planned)
- Capacitor (planned) for mobile deployment

### Backend

- Flask (main server)
- FastAPI (route service) with ORS (Open Route Service) integration
- SQLite (development database), planned migration to PostgreSQL with Docker support

### DevOps & Tooling

- GitHub Actions for CI/CD and testing
- Conda for Python environment management
- pnpm for frontend dependency management
- ngrok for exposing local servers for remote testing
- Docker (planned) for deployment and backend upgrades
