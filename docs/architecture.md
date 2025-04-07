# Major Directory Overview

## Backend

```
backend/
└── backend_tests/                      Contains backend unit tests
└── database/                           Contains the whole database of the project
└── server/                             Core backend folder where the Flask and FastAPI server resides
    └── models/                         Defines data structures like User, Riding Map-routes, Activities, etc.
    └── routes/                         Defines Flask blueprints such as auth.py, profile.py for subfunctions
    └── utils/                          Defines useful and mostly standardized helper functions such as api_response(success, data, message, status_code) to replace the previous jsonify(xxx), code explicit return
    ├── app.py                          The main program to host the Flask server
    └── config.py, extensions.py        Configuration files, e.g., config.py sets the database location
```

## Frontend

```
frontend/
└── public/                             Static public files such as the ico of the project
└── src/                                Main source folder of the frontend (React + TypeScript)
    └── assets/                         Static files such as animation gif and png for loading
    └── authentication/                 Handles authentication logic (e.g., login, logout, register, auth token)
    └── components/                     Reusable or feature-specific UI components
        └── context/                    Global state management using React Context API
        └── maps/                       Map-related components (e.g., route drawing, markers, location view)
        └── pages/                      Page-level components corresponding to routes (e.g., LoginPage, MapPage)
        └── .../                        Other component subfolders
    └── tests/                          Contains frontend unit and integration tests, powered by Vitest
    ├── App.css, index.css              Application-wide CSS styles
    └── App.tsx, main.tsx               Root component (`App.tsx`) and React entry point (`main.tsx`)

├── index.html                          HTML template used by Vite
├── vite.config.ts                      Vite configuration file (build, dev server, plugins, etc.)
└── ...                                 Other Relevant Configuration Files
```

## Frontend Map folder

```
frontend/src/components/maps/           This folder contains modular components for map rendering and interaction using Leaflet
├── MapView.tsx                         Main map container with tile setup and layout
├── RoutePolyline.tsx                   Draws the route line on the map
├── WaypointMarkers.tsx                 Displays waypoints for any route
├── UserLocationMarker.tsx              Shows the user's current location
├── SetViewToLocation.tsx               Adjusts the map view to follow location updates
└── AutoFocusView.tsx                   Auto-fits the map to show all relevant points, if possible
```

## What's more

←[Previous: Scripts](scripts.md); ↓[Go back to Documentation](./README.md); [Next: Contribute Code](contribute-code.md)→
