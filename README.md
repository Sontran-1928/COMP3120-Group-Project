# NSW Driver's Toolbox

# NSW Drivers Toolbox Outline
We set out to achive a Web Application that would be the swiss army knife for Fuel and Road interactions for NSW. A central point to view and interact with data collected from Service NSW. From Fuel Stations, Road Hazards, Toll Roads and point to point mapping. To do this our back-end would connect with the Service NSW API and pull relevent JSON data and pass it to our front-end to display and interact with. The various methods for data interaction included but not limited to were.

*Petrol Stations: Their locations (address and coordinates), brands, fuel types and cost.
*Hazards: Locations, what to do when encountered (Advice, Speed Limit changes etc)
*Maps: Pins for Stations and Hazards, point to point directions with toll road calculations, fuel available near users
*Users: Sign-up, logins and database functions to house user preferences, histories and Saved Searches for individual users
*Analytics: Market Trends (Daily/Weekly/Monthly), Lowest prices to Highest
*General information on fuel, hazards and how to navigate NSW

Putting this all together we aimed to provide this application to users on the road or for planning trips to and from locations in NSW. Individuals with vehicles from driving age onwards would have most use for this aplication.

## What we set out to do
We had a very ambitious product in mind. A lot of what we set out to do and what we came back with was limited to the time we had. In the 4 sprints we were able to achive quite a bit.
Given the scope of the ambition and time we narrowed our design focus to a more realistic goals.

### Sprint 1:
Initial week, we’ll begin by accessing our API’s we want to build from and create some dummy 
API data to work from (due to subscription limitations) and store them in some format. From 
here we shall initialise our React project and Database.

*Setup of API subscriptons
*Test Data
*Building Framework

### Sprint 2:
Here we will be focused on the Backend of the Web Application. Making sure we can access 
the formatted Dummy Data, DB framework and have our front end talking with our backend.

*Back-end functionality
    *Accessing Dummy API data
    *Accessing Database facilities for user info storage, analytics etc
    *Data management/integrity correctly used
*Front-end functionality
    *Data is retrievalbe

#### Sprint 3:
We can start building out our front end. Setting up of pages to house relevant 
information and readable display of data, and the bulk of features will be built out.

*Front-end framework
    *User Interface
    *Visual Display of data (list form)
    *Testing
    *Tabs/Routes/Pages

### Sprint 4:
Our final week we hope to have achieved enough progress that we can then integrate the Live 
API information into our project and then finish up with more rigorous testing and polishing of 
the product.

*Integrating Live API with front-end
*Finishing up styles/formating overall look.

### What we achieved 
The product we came out with was close to what we scoped out.
Our backend built in Express with working end-points to the NSW API came through clear. 
The front-end allowed for users to search for fuel prices based on location and station, analytics like fuel averages for the four main fuel types were available too. 
Lists of Hazards accross NSW were formatted and displayed in list form. 
We used caching and some clever coding to help deal with rate limits on the API's.

For testing we implemented Github Actions that uses the Github SuperLinter(https://github.com/super-linter/super-linter) to lint all types of files in our project. However, due to time constraints we were not able to write tests four our project so right now no tests get run during our Github actions runs. 

Overall we didn't achieve the User accessability for logins and preferences but we did come through with the Openlayers map integration instead interestingly enough, which was one of our stretch goals. This all being said I think our MVP and progress shows that we've been quite on target with scope and development progress and can comfortably say we have achieved a substantial amount.

## Video
Feel free to look our video for completion

# Work Over View

## Front End - Adem Halac
### File Structure
I chose to build out the Front-End in this manor to better present, modify and build the components of the site.
This structuring helped manage the speed of development and legibility of the components.

Overall the directory structure is pathed out as such:
**/src**
    */Components:* Houses the independant js files that do the bulk of the work. These files are modular and can be reused in other places once imported correctly
    */Pages:* This directory is where the Routing draws it's information from. 
    */Server:* The express backend build with their specific API endpoints to NSW Services is housed
**/public**
    */Css:* Skeleton.css is saved here, and with some slight modifications we've designed the site with this file

## NSWDTB-wide
The banner image was an AI solution, we generated it through Microsoft Designer, we tried it keep it fairly simple as it wasn't the main focus of the task. No code in the project was written by AI, I'd just like to point out.


### App.js:
The bulk of the front end begins here, and data that is called by Axios.get functions is mostly grabbed from here also. 
Up top we have our React, banner and pages importing in.
The three main Axios calls for Hazards, Stations and the FuelWidget are made here and pass the response data to the corresponding useStates.
A useEffect hook is used to handle these update transitions

The return was designed as such to keep the code cleaner and easier to read.
It's broken down into two blocks. 
The first container houses teh banner and the second comprises the React Routing.
The React-Router class houses the nav bar and the `<routes>` for the paths.
This is also where the Data from the Axios calls gets passed down into, to then trickled down into the components.

### /Pages
This is where the pages for the routing have been stowed. Most of the pages are fairly simple, they serve as a place holder for the Routing to navigate to and generally house the main HTML components to be displayed on the page when the links clicked or initialised.

*HazardRoute:* Contains the start of the Table to display the hazards. You'll notice the `<thead>` and internal components `<tr>` and `<th>` are placed and the details of the `<tbody>` are mapped out through the passed in Data from App.js into the Hazard component

*HomeRoute:* The main page is booted to this file. It contains 3 components and a button. Really simple button calls a useNavigate hook and loads the /full-map path or more accurately MapRoute this works because of the way the React Routing was initially built in App.js. The url calls resolve to /full-map route and then displays that page. The first component `<SearchByLocation />` is displayed in this container. The data being pulled from that imported component, as with other two `<SearchByStation />` and `<FuelWidget />`. FuelWidget gets some extra attention with the Data from the FuelWidget Axios call on App,js

*InfoRoute:* This page is a simple table displaying some basic information about the types of fuel and the explanation of what it is. 

*MapRoute:* A page to simply view the Openlayer map in a large form. It was made to be cycled to when certain buttons are pushed on the site and is great to see all the Stations and Hazards that are currently live on Services NSW

*PricesRoute:* This page get's called to view prices being passed to it

*StationRoute:* This page builds out the Station list from the API. It is just a return statement that deploys the main parts of a `<table>` similarly to HazardRoute it has the main components for the table and then passes the Data into a map that builds out the table elements.

### /Components
This is housing the components to be deployed via importing. It is reausable code for the most part and can be utilised when the data is passed in.

*FuelWidget:* This component is quite simple, it takes the WidgetPrices data from App.js, filters out the data into seperate collections by fuel type (E10, U91, etc), and then on each of those collections steps through, totals and then averages them out to be displayed. To keep the foramting to 2 decimal places .toFixed is used to do so.
The return then punches out a table with the averaged calucations for display

*Hazard:* This component runs in tandem with HazardRoute. It takes in the properties passed in by the map from HazardRoute then distributes the information to another map which finishes the `<tbody>` with `<tr>` and `<td>`. The addition of a button on each of the table elements is used to be able to navigate to the specific coordinates point on the OpenLayers map.
A small conditional statement is used to check if the data HAS a speed limit as it comes in as "-1" if not and the "-1" is replaced with "No Change" for display, for more human readable way.

*Price:* This component is used to build out the prices when they need to be displayed. The initial code was fairly barebones. With the assistance of @Sontran-1928 we were able to flesh out it's functionality a bit better by adding a fuel name to each of the elements and by adding an Axios.get call to fetch prices by station ID. To do this a couple of useStates and useEffect hooks were used.
FilerName() takes the input code and searches by that if there isn't a name then it returns "unavailable".

*SearchByLocation:* is a component that runs on the HomeRoute. This is the working code to access the Express Endpoint specific for searching by location. It initialises two useStates searchLocation and stationList.
SearchLocation is used to house the input from the form and the second useed to houe the filtered data from the endpoint.
The form itself in the Return calls on handleChange() to take in the typed information and the formHandler() accesses the Express Endpoint `/fuel/location` and tacks on the searchLocation that was typed in the form, the call then passes the information to searchLocation.

Due to Objects being Undefined or Defined we've had to employ the "?" operator on the stationList, to check if the object information WAS defined first, otherwise the application would crash with some errors.
The return statement returns a blank <> to house the containers, without which react didn't like things otherwise. 
The first container is the form and the second only comes into display if the stationList is defined.

So the form, onSubmit does the handler and the onChange runs handleChange and the table displays the filtered stationList via a map and tacks on two buttons for prices and a Openlayers.

*SearchByStation:* does more or less the same thing as above only that the Express endpoint only returns Fuel Values `fueltype` and `price` so it's just form and a simple map.

*Station:* Is a component that is used by StationRoute to return back the formatted table data mapped. It also adds two buttons that shows the prices for that specific table element and the same with a map pin.

### /Server
This is where the express backend is housed and where the API endpoints are access from

### /Public
The only information being altered or added is a CSS file
*Skeleton.css*: Some minor changes to tables and some sizing. The boilerplate file was downloaded from [GetSkeleton](https://getskeleton.com/)

## Openlayers map - Son Tran

At the beginning of the project, Google Map was going to be implemented into the project. However after discovering the cost to implement it, the team decided to change to Openlayers, which was recommended by from the feedback from the group project proposal.

Openlayers is free open-source library which is used to display a map on the web application. Openlayers itself is a map, however within the library are many different APIs that can be used to make the map contain important information according the the developer's need.

The source code for openlayers used in this project is found in `./src/openlayers.js` which I'll use as reference.

### Package installation

In order to import Openlayers into the project, the packages needs to be installed first.
This can by done entering the commands...

1. `npm install ol`
2. `npm install ol-popup`
   into the preferred code editor's terminal. This will install the official openlayers library (`ol`) and an unofficial openlayers popup libraray (`ol-popup`).

### Implementation

Implementation can be a bit complicated, however after implementing it once, it will get easier.

#### Map

1. Firstly, the map reference constant is defined so that it can be used to html reference later on.
2. A map element constant so that map can target on.
3. A view object using `View` from import earlier, this view object needs to 1 `projection` important parameter and several optional parameter. More can be found at [1].
4. Now the map object can be implemented via `Map` from import too. The map also require several parameters as seen in the `openlayers.js`. More can be found on [2]
5. Then in the return function of the component, a `div` must be created with the parameter `ref` which points to the map reference from step 1.

With this a simple empty map is created. However to add things such as markers and popup will require a bit more coding.

#### Markers

1. To create a marker, a `VectorLayer` is created with the parameter source containing a `VectorSource`. The vector source can filled with parameter called `features` More on [3] [4].
2. The `features` parameter is essentially an array, which is used to display multiple markers on the map.
3. A `Feature` object is created via the function `createHazardMarker(hazardData)` and `createFuelStationMarker(stationData)` as seen in `openlayers.js`.
4. In the source code within the project, each fuel station and hazard data is collected via APIs from the backends.
5. Before adding the `Vectorlayer` to the map, we need to set the icon style to the marker in order for it to appear on the map.
6. By using `Style` and `Icon` objects (more on [5] [6]), an image for each markers was defined in `openlayers.s`
7. The style is set into their respective `VectorLayer`.
8. Once done, the `VectorLayer` is added as a new layer into the `Map`

Now the map is populated with 2 marker type, which display a small icon when there's either a fuel station or hazard there.

#### Popup

Popups are a little different to markers and can be difficult to implement, however the library `ol-popup` (more on [7]) simplify this process.

1. Define a constant popup similar to `openlayers.js`
2. This popup is then added to the map via "map.addOverlay(popup)"
3. A on click event is added to the map. This event checks for the coordinates at which the user click on, and checks if there a features there. More in `openlayers.js`
4. If there's a feature, then `openlayers.js` collect and display data using `popup.show(event.coordinate, displayData)`

#### Outside openlayers.js implementation

In the web app, on hazards and station pages are list of the hazards and fuel station information. However on those pages are also buttons to which when pressed, will display map page, and focus on the point of interest. To do this both hazard and station pages will navigate to the map and feed a state parameter.
In both these components, they use a `useNavigate` function which was shorten to `navigate` to redirect the current component to a different component. As seen in both hazard and station component, the `/full-map` was used as the first parameter in the `navigate` function to route the web app to the openlayers map page.

##### In hazards.js

Using the function `navigateToMap`, a `state` parameter was added into the `navigate` function. In this `state`, the hazard coordinates array (in `[longitude, latitude]`) will is fed here.

##### In station.js

Similar to hazard component, the station component also have a `navigateToMap` function and a `state` parameter added into the `navigate` function. However the coordinate is currently an object, not an array in this component. Hence the coordinate is converted into an array first, then fed into the `state` as parameter in the `navigate` function.

#### In openlayers.js

In openlayers component, `useLocation` was imported from `react-router-dom` library to extract the state data from both hazard and station components. And these data was stored into a `location` constant with `useLocation().state.coordinates`. However to prevent errors due to there being no state by simply entering the map via the nav link, a simple check is `useLocation().state` was performed before setting `location` constant.
This `location` constant was then used to create a new `View` object (more on [1]) with the center paramter using the `location` coordinate.

[1] https://openlayers.org/en/latest/apidoc/module-ol_View-View.html
[2] https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html
[3] https://openlayers.org/en/latest/apidoc/module-ol_layer_Vector-VectorLayer.html
[4] https://openlayers.org/en/latest/apidoc/module-ol_source_Vector-VectorSource.html
[5] https://openlayers.org/en/latest/apidoc/module-ol_style_Style-Style.html
[6] https://openlayers.org/en/latest/apidoc/module-ol_style_Icon-Icon.html
[7] https://github.com/walkermatt/ol-popup

## Backend Server - Adam Fulton
  - The backend express server for this project is contained within `src/server/server.js`.
  - ## The following data sources are used by the API:
    - Fuel API: `https://api.nsw.gov.au`
      -  used to retrieve all related fuel and petrol station information.
    - Hazards API: `https://opendata.transport.nsw.gov.au`
      - used to retrieve all information about hazards in NSW.

    - ## General Information:
      - The express backend server implements authentication by implementing express middleware to check for the apikey token on each request.
      - The express server also utilises caching using the following library: https://www.npmjs.com/package/apicache.
        - the cache is set to 30 minutes and is used on all endpoints in order to improve response time and reduce the number of calls made to the data sources as each have strict rate limits.
      - On each API request to the server, the server makes a axios call the corresponding endpoint in each data source and returns the data.
      - The express server is also used to serve the built react appication.   
     
	- ## The express json server has the following endpoints:

       - `/api/incident/open`
      
          - GET request that calls NSW gov traffic hazards API and
  returns all current traffic hazards. 
  
  	  - `/api/incident/open/:suburb`
      
  		- GET request that calls NSW gov traffic hazards API and
  returns all current traffic hazards given a suburb.
  
  	  - `/api/alpine/open`
      
  	    - GET request that calls NSW gov traffic hazards API and
  returns all current apline related traffic hazards.
  
       - `/api/fire/open`
      
  	      - GET request that calls NSW gov traffic hazards API and
  returns all current fire related traffic hazards.
  
        - `/api/flood/open`
      
  	      - GET request that calls NSW gov traffic hazards API and
  returns all current flood related traffic hazard
  
       - `/api/majorevent/open`
        
    	    - GET request that calls NSW gov traffic hazards API and
    returns all current majorevent related traffic hazards.
    
       - `/api/roadwork/open`
          
      	  - GET request that calls NSW gov traffic hazards API and
      returns all current roadwork related traffic hazards.
      
       - `/api/regional-lga-incident/open`
          
      	  - GET request that calls NSW gov traffic hazards API and
      returns all current lGA related traffic hazards in regional areas.
      
       - `/api/fuel/prices`
          
      	  - GET request that calls NSW gov fuel API and
      returns all current prices across all stations and petrol types in NSW. 
      
       - `/api/fuel/prices/:fueltype`
          
      	  - GET request that calls NSW gov fuel API and
      returns all current prices across all stations for a specific fueltype in NSW. 
      */
      
       - `/api/fuel/location/:location`
          
      	  - GET request that calls NSW gov fuel API and
      returns all current petrol stations across all petrol types when given a suburb or postcode
      
       - `/api/fuel/lovs`
          
      	  - GET request that calls NSW gov fuel API and
      returns all current fuel stations along with fueltypes and station brands. 
      
       - `/api/fuel/prices/new`
          
      	  - GET request that calls NSW gov fuel API and
      returns all list of fuel prices that have been updated across all stations. 
      
       - `/api/fuel/prices/station/:stationcode`
          
      	  - GET request that calls NSW gov fuel API and
      returns information on a specific station such 
      as price when given a station code as a parameter. 
      
       - `/api/fuel/prices/location`
          
      	  - POST request that calls NSW gov fuel API
      Body: requires a fuel type and suburb/postcode
      returns: all petrol stations with that fuel type in that suburb/postcode

# Continuation Of Project

 if we were to continue the project into the future we would do the following:
   - Improve the overall design of frontend, as we spent most of this time working on the functionality.
   - Refactoring the backend to make it easier to test.
   - Writing tests for both frontend and backend.
   - Adding petrol station brand images on the map.
   - Adding pagination to fuel stations endpoint.
   - Adding sorting by cheapest fuel price.
   - integrating with more data sources from the NSW goverment.

# Main roles and Contributions on the project

 The following is a breakdown of the main roles for each member of the project:
  - Adam Fulton: 45634092
  	- Contributed to developing the backend API and integrating with the data sources.
   	- Setup Github branch protections and added Github actions
- Son Tran: 46457224:
	- Contributed to developing the frontend and worked on the openlayers map.
 - Adem Halac: 45271119
 	- Contributed to the frontend,design and retreving data from the API to be displayed on each page such as fuel stations, prices and being able to search by location and dispalying the fuel stations.  
