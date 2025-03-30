# Usage

## Table of Contents

- [Run This Project](#run-this-project)
- [User Authentication](#user-authentication)

## Run This Project

1. In the command line, go to the project folder, then `cd scripts`.

2. If frontend and backend are not configured yet, follow instructions in the previous two paragraphs.

3. Run the `run` script. It will pop up 4 terminal windows while 3 of them will remain open.

4. Please always test the frontend using Chrome, regardless of whether you are on a computer or a phone. We have not converted this project into a mobile app using `Capacitor` yet.

5. To test locally on the same machine that is hosting the app, visit `http://localhost:5173`. This will allow geolocation to work correctly.

6. To test on a different device, follow the following instructions:

   a. Connect both the hosting and testing devices to the same LAN (e.g., via hotspot).

   b. Do NOT use the LAN IP address directly, as modern browsers block geolocation on non-HTTPS origins for security reasons.

   c. Run `ngrok http 5173` on the hosting device, and visit the address shown in "Forwarding", like `https://ec0f-96-63-200-99.ngrok-free.app` (it may changes all the time). Be sure to use `https://`!

   d. Troubleshoot: If the map still doesn't show your location, check the location permissions for Chrome on your device.

7. To kill the project, run `ctrl+c` on all popped-up terminals. Then safely close those terminal windows.

## User Authentication

1. In the virtual environment, run the following command, line by line. Note there is a `;` at the end of the 3rd line.

   ```
   sqlite3
   .open userinfo.db
   SELECT * from user;
   ```

2. If working correctly, following content should display

   ```
   1|Alice|alice@example.com|pbkdf2:sha256:<hash-here>
   2|Boyang|boyangl3@illinois.edu|pbkdf2:sha256:<hash-here>
   3|Brian|pg22@illinois.edu|pbkdf2:sha256:<hash-here>

   ```

3. To exit the `sqlite3` environment, run `.exit`.

## Open Route Service API

We are using Open Route Service to calculate the route. It takes the coordinates of 2 points and return a `geojson` that contains the route info. The API requires a key to limit the calling frequency, however, the free plan would be enough for our project (2000 calls per day).

I stored my key in a file and I will send to you privately. Please put the file under `backend/routes` folder. Then everything should work. **Never make the API key public (including add it into the Github repo)!**

You can also request a new API by registering an account at [openrouteservice.org](openrouteservice.org).


## Go back to README

[Go back to README](./README.md)
