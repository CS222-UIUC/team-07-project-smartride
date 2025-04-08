# Usage

## Table of Contents

- [Run This Project](#run-this-project)
- [User Authentication](#user-authentication)
- [Open Route Service API](#open-route-service-api)

## Run This Project

1. If frontend and backend are not configured yet, follow [installation.md](installation.md) first.

2. In the command line, go to the project folder, then `cd scripts`.

3. Run the app stack by:

   ```
   ./run.sh  # on macOS/Linux
   run.ps1   # on Windows PowerShell
   ```

   This will launch the whole app stack. If everything is set up corrected, you should see 4 windows popping out, leaving 3 active.

4. Get to know about using automatic scripts in [scripts.md](scripts.md). (Highly recommended)

5. Please always test the frontend using Chrome, regardless of whether you are on a computer or a phone. We have not converted this project into a mobile app using `Capacitor` yet.

6. To test locally on the same machine that is hosting the app, visit `http://localhost:5173`. This will allow geolocation to work correctly.

7. To test on a different device, follow the following instructions:

   a. Connect both the hosting and testing devices to the same LAN (e.g., via hotspot).

   b. Do NOT use the LAN IP address directly, as modern browsers block geolocation on non-HTTPS origins for security reasons.

   c. Run `ngrok http 5173` on the hosting device, and visit the address shown in "Forwarding", like `https://ec0f-96-63-200-99.ngrok-free.app` (it may change every time). Be sure to use `https://`!

   d. Troubleshoot: If the map still doesn't show your location, check the location permissions for Chrome on your device.

8. To kill the project, run `ctrl+c` on all popped-up terminals. Then safely close those terminal windows.

## User Authentication

1. In the virtual environment, run the following command, line by line. Note there is a `;` at the end of the 3rd line.

   ```
   sqlite3
   .open userinfo.db
   SELECT * from user;
   ```

2. If working correctly, content should display similar to below:

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

←[Previous: Team Google Drive and Environment Variables](drive-env.md); ↓[Go back to Documentation](./README.md); [Next: Scripts](scripts.md)→
