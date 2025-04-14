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
    └── api/                            Handles authentication logic (e.g., login, logout, register, auth token)
    └── maps/                           Map-related components, see below
    └── components/                     Reusable or feature-specific UI components
        └── context/                    Global state management using React Context API
        └── pages/                      Page-level components corresponding to routes (e.g., LoginPage, MapPage)
        └── .../                        Other component subfolders
    └── tests/                          Contains frontend unit and integration tests, powered by Vitest
    ├── App.css, index.css              Application-wide CSS styles
    └── App.tsx, main.tsx               Root component (`App.tsx`) and React entry point (`main.tsx`)

└── android/                            The Capacitor-generated folder for our project on android platform.
└── ios/                                The Capacitor-generated folder for our project on ios platform.

└── dist/                               A git ignored folder that contains the builded project, triggered by pnpm run build.

├── index.html                          HTML template used by Vite
├── vite.config.ts                      Vite configuration file (build, dev server, plugins, etc.)
├── capacitor.config.ts                 Capacitor configuration file (the app package name, etc.)
└── ...                                 Other Relevant Configuration Files
```

## Frontend Map folder

```
frontend/src/maps/                      This folder contains modular components for map rendering and interaction using Leaflet
└── manage
    ├── structure.ts                    Contains all the data structure for rendering the map and the route.
    └── operations.ts                   Implements all functionalities MapPanel needs, like deleting a point or switching two points, connect with structure and MapView.
└── widgets
    ├── AutoFocusView.ts                Focus to any point or any set of points.
    ├── ClickHandler.ts                 Handles click behavior on the map.
    ├── PanelButton.ts                  Button to open the map panel.
    ├── PointMarker.ts                  Marks all main points on the map.
    ├── RoutePolyline.ts                Draw the user-designed route on the map.
    └── UserFocusView.ts                When launched, trigger an one-time only focus to the current position of user.
├── MapView.tsx                         Main map container that connects with MapPanel to control the logic.
└── MapPanel.tsx                        A slide panel that opens from bottom, which contains all added points on the map that you can manage.
```

## What's more

←[Previous: Scripts](scripts.md); ↓[Go back to Documentation](./README.md); [Next: Contribute Code](contribute-code.md)→
