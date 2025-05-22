// dependencies
const express = require('express')
const app = express()
const apicache = require('apicache')
const axios = require('axios')
const cors = require('cors')
const az_identity = require('@azure/identity');
const az_kv = require('@azure/keyvault-secrets');

const credential = new az_identity.DefaultAzureCredential();
const client = new az_kv.SecretClient('https://newsecretvault.vault.azure.net/', credential)



require('dotenv').config()

// 36000000 = 10 hours in milliseconds used to refresh fuel oauth token.
const REFRESH_TOKEN_TIME = 36000000

// creates cache
const cache = apicache.middleware

// base urls for hazards and fuel api retrieved from .env
const FUEL_API_BASE = process.env.FUELAPIURL
const LIVE_TRAFFIC_API_BASE = process.env.LIVETRAFICAPIURL

// api keys for both hazards and fuel apis along with api key needed for clients.
const APIKEY = process.env.APIKEY
const LIVE_TRAFFIC_APIKEY = process.env.LIVETRAFFICHAZARDSAPIKEY
const FUEL_APIKEY = process.env.FUELAPIKEY

// authorization header for fuel api that is sent with each request.
const FUELAPIAUTHORIZATIONHEADER = process.env.FUELAPIAUTHORIZATIONHEADER

// used to keep track of current transactionId that is sent with each request to fuel api.
let transactionid = 1

// list of fuel types
const FUEL_TYPES = ['E10-U91', 'E10', 'U91', 'E85', 'P95-P98', 'P95', 'P98',
  'DL', 'PDL', 'B20', 'EV', 'LPG', 'H2', 'CNG']

// stores the current oauth token for the fuel api.
let FuelOauthToken = ''

//app.use(express.static("build"))

// sets CORS middleware.
app.use(cors())

// sets json middleware parser
app.use(express.json())

app.use(express.static('build'))

/*
middleware that intercepts all requests and checks if
the request contains the appropairate api key
*/
app.use('/api/*', (req, res, next) => {
  // gets value from header
  const token = req.headers.apikey

  // returns 401 if there is no token or token is incorrect otherwise continues.
  if (token === undefined) {
    res.status(401).send('Failed to authenticate please provide a api key')
  } else if (token !== APIKEY) {
    res
      .status(401)
      .send('Failed to authenticate please provide a valid api key')
  } else {
    // continues
    next()
  }
})

/*
endpoint used to ensure we return the index.html page when navigating to different pages
in the react app that also uses a regualar expression to not match routes used for the API.
*/
app.get(/^(?!\/api\/).*$/, (req, res) => {
  res.sendFile('build/index.html', { root: '.' })
})

// sets middleware to cache all api responses for 30 minutes.
app.use(cache('30 minutes'))

/*
TRAFFIC HAZARDS ENDPONTS BELOW
*/

/*
GET request that calls NSW gov traffic hazards API and
returns all current traffic hazards.
*/
app.get('/api/incident/open', (req, res) => {
  // calls nsw gov hazards API
  axios
    .get(LIVE_TRAFFIC_API_BASE + '/incident/open', {
      headers: {
        Authorization: `apikey ${LIVE_TRAFFIC_APIKEY}`,
        Accept: 'application/json'
      }
    })
    .then((response) => {
      // return data from nsw gov API
      res.send(response.data)
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error('An error occurred trying to return open incidents:', error)
      res.status(500).send('an unexpected error occured please try again later')
    })
})

/*
GET request that calls NSW gov traffic hazards API and
returns all current traffic hazards given a suburb.
*/
app.get('/api/incident/open/:suburb', (req, res) => {
  // get suburb from parameters
  const suburb = req.params.suburb

  // check if suburb is valid.
  if (suburb === undefined || suburb.length < 3 || suburb.length > 100) {
    res.status(400).send('please provide a valid suburb')
  }

  // calls nsw gov hazards API
  axios
    .get(LIVE_TRAFFIC_API_BASE + '/incident/open', {
      headers: {
        Authorization: `apikey ${LIVE_TRAFFIC_APIKEY}`,
        Accept: 'application/json'
      }
    })
    .then((response) => {
      // filter by provided suburb
      const filterBySuburb = response.data.features.filter((features) =>
        features.properties.roads.some((roads) => roads.suburb === suburb)
      )
      // return filtered json array
      res.send(filterBySuburb)
    })
    .catch((error) => {
      // log error to console and return 500 status code
      console.error('An error occurred trying to open incidents by suburb:', error)
      res.status(500).send('an unexpected error occured please try again later')
    })
})

/*
GET request that calls NSW gov traffic hazards API and
returns all current apline related traffic hazards.
*/
app.get('/api/alpine/open', (req, res) => {
  // calls nsw gov hazards API
  axios
    .get(LIVE_TRAFFIC_API_BASE + '/alpine/open', {
      headers: {
        Authorization: `apikey ${LIVE_TRAFFIC_APIKEY}`,
        Accept: 'application/json'
      }
    })
    .then((response) => {
      // return data from nsw gov API
      res.send(response.data)
    })
    .catch((error) => {
      // log error to console and return 500 status code
      console.error('An error occurred trying to return open alpine incidents:', error)
      res.status(500).send('an unexpected error occured please try again later')
    })
})

/*
GET request that calls NSW gov traffic hazards API and
returns all current fire related traffic hazards.
*/
app.get('/api/fire/open', (req, res) => {
  // calls nsw gov hazards API
  axios
    .get(LIVE_TRAFFIC_API_BASE + '/fire/open', {
      headers: {
        Authorization: `apikey ${LIVE_TRAFFIC_APIKEY}`,
        Accept: 'application/json'
      }
    })
    .then((response) => {
      // returns data from nsw gov API
      res.send(response.data)
    })
    .catch((error) => {
      // log error to console and return 500 status code
      console.error('An error occurred trying to return open fire incidents:', error)
      res.status(500).send('an unexpected error occured please try again later')
    })
})

/*
GET request that calls NSW gov traffic hazards API and
returns all current flood related traffic hazards.
*/
app.get('/api/flood/open', (req, res) => {
  // calls nsw gov hazards API
  axios
    .get(LIVE_TRAFFIC_API_BASE + '/flood/open', {
      headers: {
        Authorization: `apikey ${LIVE_TRAFFIC_APIKEY}`,
        Accept: 'application/json'
      }
    })
    .then((response) => {
      // returns data from nsw gov API
      res.send(response.data)
    })
    .catch((error) => {
      // log error to console and return 500 status code
      console.error('An error occurred trying to return open flood incidents:', error)
      res.status(500).send('an unexpected error occured please try again later')
    })
})

/*
GET request that calls NSW gov traffic hazards API and
returns all current majorevent related traffic hazards.
*/
app.get('/api/majorevent/open', (req, res) => {
  // calls nsw gov hazards API
  axios
    .get(LIVE_TRAFFIC_API_BASE + '/majorevent/open', {
      headers: {
        Authorization: `apikey ${LIVE_TRAFFIC_APIKEY}`,
        Accept: 'application/json'
      }
    })
    .then((response) => {
      // returns data from nsw gov API
      res.send(response.data)
    })
    .catch((error) => {
      // log error to console and return 500 status code
      console.error('An error occurred trying to return open majorevents:', error)
      res.status(500).send('an unexpected error occured please try again later')
    })
})

/*
GET request that calls NSW gov traffic hazards API and
returns all current roadwork related traffic hazards.
*/
app.get('/api/roadwork/open', (req, res) => {
  // calls nsw gov hazards API
  axios
    .get(LIVE_TRAFFIC_API_BASE + '/roadwork/open', {
      headers: {
        Authorization: `apikey ${LIVE_TRAFFIC_APIKEY}`,
        Accept: 'application/json'
      }
    })
    .then((response) => {
      // returns data from nsw gov API
      res.send(response.data)
    })
    .catch((error) => {
      // log error to console and return 500 status code
      console.error('An error occurred trying to return open roadwork incidents:', error)
      res.status(500).send('an unexpected error occured please try again later')
    })
})

/*
GET request that calls NSW gov traffic hazards API and
returns all current lGA related traffic hazards in regional areas.
*/
app.get('/api/regional-lga-incident/open', (req, res) => {
  // calls nsw gov hazards API
  axios
    .get(LIVE_TRAFFIC_API_BASE + '/regional-lga-incident/open', {
      headers: {
        Authorization: `apikey ${LIVE_TRAFFIC_APIKEY}`,
        Accept: 'application/json'
      }
    })
    .then((response) => {
      // returns data from nsw gov API
      res.send(response.data)
    })
    .catch((error) => {
      // log error to console and return 500 status code
      console.error('An error occurred trying to return open regional-LGA incidents:', error)
      res.status(500).send('an unexpected error occured please try again later')
    })
})

/*
FUEL API ENDPOINTS BELOW
*/

/*
GET request that calls NSW gov fuel API and
returns all current prices across all stations and petrol types in NSW.
*/

app.get('/api/fuel/prices', (req, res) => {
  // calls nsw gov fuel API
  axios
    .get(FUEL_API_BASE + '/FuelPriceCheck/v2/fuel/prices', {
      headers: {
        Authorization: `Bearer ${FuelOauthToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json charset=utf-8',
        apikey: FUEL_APIKEY,
        transactionid,
        requesttimestamp: getTodaysDate()
      }
    })
    .then((response) => {
      // increase transactionid count by 1.
      transactionid += 1

      // return data fom fuel API
      res.send(response.data)
    })
    .catch((error) => {
      // log error to console and return 500 status code
      console.error('An error occurred trying to return fuel prices:', error)
      res.status(500).send('an unexpected error occured please try again later')
    })
})

/*
GET request that calls NSW gov fuel API and
returns all current prices across all stations for a specific fueltype in NSW.
*/
app.get('/api/fuel/prices/:fueltype', (req, res) => {
  // get fueltype from parameter
  const fueltype = req.params.fueltype

  if (!FUEL_TYPES.includes(fueltype)) {
    res.status(400).status('please provide a valid fuel type')
  }

  // calls nsw gov fuel API
  axios
    .get(FUEL_API_BASE + '/FuelPriceCheck/v2/fuel/prices', {
      headers: {
        Authorization: `Bearer ${FuelOauthToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json charset=utf-8',
        apikey: FUEL_APIKEY,
        transactionid,
        requesttimestamp: getTodaysDate()
      }
    })
    .then((response) => {
      // increase transactionid count by 1.
      transactionid += 1

      // filter prices by fueltype
      const pricesByFuelType = response.data.prices.filter(
        (fuel) => fuel.fueltype === fueltype
      )

      // return data fom fuel API filtered by fueltype
      res.send(pricesByFuelType)
    })
    .catch((error) => {
      // log error to console and return 500 status code
      console.error('An error occurred trying to return fuel prices by fueltype:', error)
      res.status(500).send('an unexpected error occured please try again later')
    })
})

/*
GET request that calls NSW gov fuel API and
returns all current petrol stations across all petrol types when given a suburb or postcode
*/
app.get('/api/fuel/location/:location', (req, res) => {
  const location = req.params.location

  if (location.length < 3 || location.length > 100) {
    res.status(400).send('please provide a valid location')
  }

  // calls nsw gov fuel API
  axios
    .get(FUEL_API_BASE + '/FuelCheckRefData/v2/fuel/lovs', {
      headers: {
        Authorization: `Bearer ${FuelOauthToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json charset=utf-8',
        apikey: FUEL_APIKEY,
        transactionid,
        requesttimestamp: getTodaysDate(),
        'if-modified-since': '09/10/2023'
      }
    })
    .then((response) => {
      // increase transactionid count by 1.
      transactionid += 1

      // filter stations based on location
      const filterByLocation = response.data.stations.items.filter((stations) =>
        stations.address.includes(location)
      )

      // return data fom fuel API filtered by location
      res.send(filterByLocation)
    })
    .catch((error) => {
      // log error to console and return 500 status code
      console.error('An error occurred trying to return fuel stations by location:', error)
      res.status(500).send('an unexpected error occured please try again later')
    })
})

/*
GET request that calls NSW gov fuel API and
returns all current fuel stations along with fueltypes and station brands.
*/
app.get('/api/fuel/lovs', (req, res) => {
  // calls nsw gov fuel API
  console.log(FuelOauthToken)
  axios
    .get(FUEL_API_BASE + '/FuelCheckRefData/v2/fuel/lovs', {
      headers: {
        Authorization: `Bearer ${FuelOauthToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json charset=utf-8',
        apikey: FUEL_APIKEY,
        transactionid,
        requesttimestamp: getTodaysDate(),
        'if-modified-since': getYesterdaysDate()
      }
    })
    .then((response) => {
      // increase transactionid count by 1.
      transactionid += 1

      // return data fom fuel API
      res.send(response.data)
    })
    .catch((error) => {
      // log error to console and return 500 status code
      console.error('An error occurred trying to return fuel reference data:', error)
      res.status(500).send('an unexpected error occured please try again later')
    })
})

/*
GET request that calls NSW gov fuel API and
returns all list of fuel prices that have been updated across all stations.
*/

app.get('/api/fuel/prices/new', (req, res) => {
  // calls nsw gov fuel API
  axios
    .get(FUEL_API_BASE + '/FuelPriceCheck/v2/fuel/prices', {
      headers: {
        Authorization: `Bearer ${FuelOauthToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json charset=utf-8',
        apikey: FUEL_APIKEY,
        transactionid,
        requesttimestamp: getTodaysDate()
      }
    })
    .then((response) => {
      // increase transactionid count by 1.
      transactionid += 1

      // return data fom fuel API
      res.send(response.data)
    })
    .catch((error) => {
      // log error to console and return 500 status code
      console.error('An error occurred trying to return new fuel prices:', error)
      res.status(500).send('an unexpected error occured please try again later')
    })
})

/*
GET request that calls NSW gov fuel API and
returns information on a specific station such
as price when given a station code as a parameter.
*/
app.get('/api/fuel/prices/station/:stationcode', (req, res) => {
  // get station code
  const stationCode = req.params.stationcode

  // check for valid station code
  if (stationCode.length > 8) {
    res.status(400).send('Please provide a valid stationcode')
  }

  // calls nsw gov fuel API
  axios
    .get(
      FUEL_API_BASE + `/FuelPriceCheck/v2/fuel/prices/station/${stationCode}`,
      {
        headers: {
          Authorization: `Bearer ${FuelOauthToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json charset=utf-8',
          apikey: FUEL_APIKEY,
          transactionid,
          requesttimestamp: getTodaysDate()
        }
      }
    )
    .then((response) => {
      // increase transactionid count by 1.
      transactionid += 1

      if (response.data.length === 0 || response.data === undefined) {
        res.status(404).send('Requested station was not found')
      }
      // return data fom fuel API
      res.send(response.data)
    })
    .catch((error) => {
      // log error to console and return 500 status code
      console.error('An error occurred fuel station prices by station code:', error)
      res.status(500).send('an unexpected error occured please try again later')
    })
})

/*
POST request that calls NSW gov fuel API
Body: requires a fuel type and suburb/postcode
returns: all petrol stations with that fuel type in that suburb/postcode
*/
app.post('/api/fuel/prices/location', (req, res) => {
  // get the body of the request
  const reqBody = req.body

  // checks for the required properties in the body of the request.
  if (reqBody.fueltype === undefined || reqBody.brand === undefined || reqBody.namedlocation === undefined || reqBody.referencepoint ||
    reqBody.sortby === undefined || reqBody.sortascending === undefined) {
    // returns 400 if there is missing required properties
    res.status(400).send('Please provide all the required properties in the body of the request')
  }

  // calls nsw gov fuel API
  axios
    .post(FUEL_API_BASE + '/FuelPriceCheck/v2/fuel/prices/location', reqBody, {
      headers: {
        Authorization: `Bearer ${FuelOauthToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json charset=utf-8',
        apikey: FUEL_APIKEY,
        transactionid,
        requesttimestamp: getTodaysDate()
      }
    })
    .then((response) => {
      // increase transactionid count by 1.
      transactionid += 1

      // return data fom fuel API filtered by location and fueltype
      res.send(response.data)
    })
    .catch((error) => {
      // log error to console and return 500 status code
      console.error('An error occurred trying to return petrol station based on fueltype and location:', error)
      res.status(500).send('an unexpected error occured please try again later')
    })
})

/*
Function used to get the current date that is used
for all requests to the nsw fuel api.
*/
const getTodaysDate = () => {
  const today = new Date()

  return `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`
}

/*
Function used to get yesterdays date.
*/
const getYesterdaysDate = () => {
  const yesterday = new Date()

  yesterday.setDate(yesterday.getDate() - 1)

  return `${yesterday.getDate()}/${yesterday.getMonth() + 1}/${yesterday.getFullYear()}`
}

/*
POST request that calls NSW gov fuel API
Body: requires a fuel type and suburb/postcode
returns: all petrol stations with that fuel type in that suburb/postcode
*/
const getFuelAccessToken = () => {
  // calls nsw gov fuel API to authenticate
  console.log("testing getting access token")
  axios
    .get(
      FUEL_API_BASE +
        '/oauth/client_credential/accesstoken?grant_type=client_credentials',
      {
        headers: {
          Authorization: FUELAPIAUTHORIZATIONHEADER,
          Accept: 'application/json'
        }
      }
    )
    .then((response) => {
      // sets fuel token from response
      FuelOauthToken = response.data.access_token
      console.log("access token got", FuelOauthToken)
    })
    .catch((error) => {
      // log error to console
      console.error('An error occurred trying to get new OauthToken for fuel API:', error)
    })
}

// runs every 10 hours to get a new access token for the fuel API.
setInterval(getFuelAccessToken, REFRESH_TOKEN_TIME)

// port number
const port = process.env.PORT || 3000

app.listen(port, () => {
  getFuelAccessToken()
})
