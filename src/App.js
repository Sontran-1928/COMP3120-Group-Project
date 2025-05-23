import './App.css'
import banner from './components/NSWDTB-wide.png' // Front page banner
// REACT
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'

// Auxillary files

// Importing pages for react routing
import HomeRoute from './pages/homeRoute'
import HazardRoute from './pages/hazardRoute'
import StationRoute from './pages/stationRoute'
import PricesRoute from './pages/pricesRoute'
import InfoRoute from './pages/infoRoute'
import MapRoute from './pages/mapRoute'

// Base URL
const URL = '/api/'

function App () {
  // useState setup
  const [hazards, setHazards] = useState([])
  const [stations, setStations] = useState([])
  const [widgetPrices, setWidgetPrices] = useState([])

  // Axios .get for Hazards
  const fetchHazards = () => {
    axios.get(URL + 'regional-lga-incident/open', {
      headers: {
        apikey: process.env.REACTAPPAPIKEY
      }
    })
      .then((response) => {
        setHazards(response.data.features)
      })
      .catch(error => {
        console.log('Error grabing Hazards: ' + error)
      })
  }
  // Axios .get for all Stations and details
  const fetchStations = () => {
    axios.get(URL + 'fuel/lovs', {
      headers: {
        apikey: process.env.REACTAPPAPIKEY
      }
    })
      .then((response) => {
        setStations(response.data.stations.items)
      })
      .catch(error => {
        console.log('Error grabing Stations: ' + error)
      })
  }
  // Axios .get for Fuel Widget
  const fetchFuelWidgetData = () => {
    axios.get(URL + 'fuel/prices', {
      headers: {
        apikey: process.env.REACTAPPAPIKEY
      }
    })
      .then((response) => {
        setWidgetPrices(response.data.prices)
      })
      .catch(error => {
        console.log('Error grabing fuel Prices: ' + error)
      })
  }

  // useEffect hook
  useEffect(() => {
    fetchHazards()
    fetchStations()
    fetchFuelWidgetData()
  }, [])

  return (
    <div className='App'>
      <header className='App-header'>
        <div>
          {/* HTML for banner implementation */}
          <img src={banner} className='App-banner' alt='banner' />
        </div>
      </header>

      <div className='React-Router'>
        <Router>
          <nav>
            {/* Nav Bar */}
            <Link to='/'>Home</Link> | <Link to='/hazards'>Hazards</Link> | <Link to='/stations'>Stations</Link> | <Link to='/information'>Fuel Information</Link> | <Link to='/full-map'>Full Map</Link>
          </nav>
          <Routes>
            {/* React Routing */}
            <Route path='/' element={<HomeRoute widgetPrices={widgetPrices} />} />
            <Route path='/hazards' element={<HazardRoute hazards={hazards} />} />
            <Route path='/stations' element={<StationRoute stations={stations} />} />
            <Route path='/prices' element={<PricesRoute />} />
            <Route path='/information' element={<InfoRoute />} />
            <Route path='/full-map' element={<MapRoute />} />
          </Routes>
        </Router>
      </div>
    </div>
  )
}
export default App
