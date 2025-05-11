# Deployed application's link

https://nsw-drivers-toolbox.onrender.com/

# Steps to build project

1. Before building the project, ensures that you have the following installed and up-to-date.

   1. Javascript
   2. Node.js
   3. npm
   4. git

2. You can ensure that these are installed in your system by running the commands without quotation marks in command terminal

   1. Node.js: `node -v`
   2. npm: `npm -v` or `npm -version`
   3. git: `git --version`

3. Once everything is installed, in your preferred code editor's terminal (Visual Studio Code, etc), navigate to the project's folder (cd "C:\group-project-wednesday-3pm-5pm-team-1\")

4. Enter `npm install` into the terminal to install all the neccessary packages.

5. In package.json at root folder, in the `"scripts"` section, the following is required...

   1. At the end of `"eject"` line, add a comma ","
   2. Add a new line below "eject" line and add `"server": "nodemon ./src/server/server.js"`

6. Ensure that the `.env` file contain all of the following keys with their respective values.

   1. ### FUEL_API_KEY

      - This can be retrieved by either logging into `https://api.nsw.gov.au`, navigating to your registered app and copying the API key into this variable, or creating an account, registerting an app
        and placing the API key into this variable.
      
   2. ### FUEL_API_SECRET_DEVELOPMENT
       
       - This can be retrieved by either logging into `https://api.nsw.gov.au`, navigating to your registered app and copying the API secret into this variable, or creating an account, registerting an app
        and placing the API secret into this variable.

   3. ### FUEL_API_URL

      -  Set this variable to, `https://api.onegov.nsw.gov.au`.
      
   4. ### LIVE_TRAFFIC_HAZARDS_API_KEY

      - This can be retrieved by either logging into `https://opendata.transport.nsw.gov.au`, navigating to your account page > API tokens and creating a new token, or creating an account, repeating the same process and placing the API token
        into this variable. 

   5. ### LIVE_TRAFIC_API_URL

      - Set this variable to `https://api.transport.nsw.gov.au/v1/live/hazards`.
       
   6. ### API_KEY

       - This is the API key that the express server checks for on each request sent to the server. This can be set to any large random string you like. 
      
   7. ### REACT_APP_API_KEY

      - This needs to be set to the same value that is set above for the `API_KEY`. This is used by the react app when sending through the key with each request to the server. 
  
   8. ### FUEL_API_AUTHORIZATION_HEADER

         - This can be retrieved by either logging into `https://api.nsw.gov.au`, navigating to your registered app and copying the authorization header into this variable, or creating an account, registerting an app
        and placing the authorization header into this variable.
       
   9. ### REACT_APP_FUEL_API_AUTHORIZATION_HEADER

     - Needs to be set to same value as `FUEL_API_AUTHORIZATION_HEADER` above. 

       
   10. ### PORT
       
       - Should be set to `3001`.

6. Enter `npm run build` once all previous steps are completed.

# Steps to run project

## `Local Development End`

The project is defaulted to deployed for production end, therefore a few things need to be changed before project can run in development end.

1.  Access server.js file in server src/server folder.
2.  Search for `app.use(express.static("build"));` and remove/comment it.
3.  Save file.
4.  Ensure .env files contain all the required keys and variables. (Check previous section for more details)
5.  Open 2 terminals in your preferred code editors and navigate to project root.
6.  In the 1st terminal run command `npm run server`
7.  In the 2nd terminal run command `npm start`
8.  Once both terminals complete, the development end project will open in a browser with localhost:3000

## `Local Production End`

1.  Ensure that the project is built, if it isn't, check the previous sections for more details.
2.  Open a terminal in your preferred code editors and navigate to project root.
3.  Run `npm run server`
4.  Open your preferred browser, enter `http://localhost:3001/` in your web URL.

## `Render Deployment`

1.  Ensure you have registered an account on render and log in.
2.  Navigate to `https://dashboard.render.com/`.
3.  At the top right, next to your username, press the blue `New` button and select `Web Service`
4.  Select `Build and deploy from a Git repository` and select `Next`
5.  Press the `Connect` button next to the correct repository "../group-project-wednesday-3pm-5pm-team-1
6.  Set a proper name in the `Name` section
7.  Ensure `Branch` section is set to 'main'
8.  In the `Build Command` section, change to `npm install && npm run build`
9.  In the `Start Command` section, change to `npm run server`
10. At the bottom of the page, press on `Advanced` and a few more options will display.
11. Select `Add Secret File`
12. At the `Filename` bar, add ".env"
13. At the `File Contents` section, add all the keys and variable from project's .env files.
14. Select `Save` once complete.
15. Select `Create Web Service`
16. The web applciation is now being deployed, it will take several minutes but once done, you can access your web application via a link at the top left, below the application's name.


# Continuous Integration

- Continuous integration was added to this project using Github actions. This can be seen in the `.github/CI.yml` folder in the root of the repository.
- the `CI.yml` was created using the started node.js actions file provided by Github.
- The starter file uses a matrix strategy that does the following across node versions 14,16,18:
   - Downloads the repo.
   - runs `npm  ci` and `npm build`.
- During the development we also added Github superlinter (https://github.com/super-linter/super-linter) to the CI pipeline which has various forms of linters and can for example,
  check our javascript and other files for styling errors and any other issues.
- The pipeline template also ran tests using `npm test`. However, this was unfortunately omitted as we ran out of time to write tests for this project.  
