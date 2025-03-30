# Usage

## Table of Contents

- [Run This Project](#run-this-project)
- [User Authentication](#user-authentication)
- [Open Route Service API](#open-route-service-api)

## Run This Project

1. In the command line, go to the project folder, then `cd scripts`.

2. If frontend and backend are not configured yet, follow [installation.md](installation.md) first.

3. Run the `run` script with the `--full` option:
   
   ```
   ./run.sh --full  # on macOS/Linux
   run.ps1 --full    # on Windows PowerShell
   ```

   This ensures your local conda environment is fully synced and unlocks `--easy` mode for faster startup in the future, it as well auto runs the following easy mode.

4. Once unlocked, you can use `--easy` mode to launch the app stack quickly:

   ```
   ./run.sh --easy
   run.ps1 --easy
   ```

   This will pull the latest code and pop up 3 terminal windows: backend, frontend, and ngrok. (On macOS, you must follow installation instructions to enable terminal scripting.)

5. Get to know about using automatic scripts in [scripts.md](scripts.md). (Highly recommended)

6. Please always test the frontend using Chrome, regardless of whether you are on a computer or a phone. We have not converted this project into a mobile app using `Capacitor` yet.

7. To test locally on the same machine that is hosting the app, visit `http://localhost:5173`. This will allow geolocation to work correctly.

8. To test on a different device, follow the following instructions:

   a. Connect both the hosting and testing devices to the same LAN (e.g., via hotspot).

   b. Do NOT use the LAN IP address directly, as modern browsers block geolocation on non-HTTPS origins for security reasons.

   c. Run `ngrok http 5173` on the hosting device, and visit the address shown in "Forwarding", like `https://ec0f-96-63-200-99.ngrok-free.app` (it may change every time). Be sure to use `https://`!

   d. Troubleshoot: If the map still doesn't show your location, check the location permissions for Chrome on your device.

9. To kill the project, run `ctrl+c` on all popped-up terminals. Then safely close those terminal windows.

## User Authentication

1. In the virtual environment, run the following command, line by line. Note there is a `;` at the end of the 3rd line.

   ```
   sqlite3
   .open userinfo.db
   SELECT * from user;
   ```

2. If working correctly, similar content should display

   ```
   1|Alice|alice@example.com|pbkdf2:sha256:<hash-here>
   2|Tester|test@example.com|pbkdf2:sha256:<hash-here>
   ```

3. To exit the `sqlite3` environment, run `.exit`.

## Open Route Service API

We are using Open Route Service to calculate the route. It takes the coordinates of 2 points and returns a `geojson` that contains the route info. The API requires a key to limit the calling frequency. However, the free plan should be enough for our project (2000 calls per day).

The key is stored in a private file and will be sent to you directly. Please put this file under the `backend/routes` folder. Then everything should work. **Never make the API key public (including adding it to the GitHub repo)!**

You can also request a new API key by registering an account at [openrouteservice.org](https://openrouteservice.org).

## What's more
←[Previous: Installation](installation.md); ↓[Go back to Documentation](./README.md); [Next: Scripts](scripts.md)→
