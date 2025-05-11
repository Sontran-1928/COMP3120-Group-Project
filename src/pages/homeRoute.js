import React from 'react'
import { useNavigate } from 'react-router-dom'
import FuelWidget from '../components/fuelWidget'
import SearchByStation from '../components/searchStation'
import SearchByLocation from '../components/searchLocation'

const HomeRoute = ({ widgetPrices }) => {
  // Setting up useNavigate
  const navigate = useNavigate()

  // Utilising useNavigate to make the page shift to full-map via a button
  const navigateToMap = () => {
    navigate('/full-map')
  }
  // Returning HTML for the welcome page and formating the widget and search bars and button placement
  return (
    <div>
      <h2>
        Welcome to our NSW Drivers Toolbox!!
      </h2>
      <div>
        <SearchByLocation />
      </div>
      <div>
        <SearchByStation />
      </div>
      <div>
        <FuelWidget widgetPrices={widgetPrices} />
      </div>
      <div>
        <button onClick={navigateToMap}>View Map</button>
      </div>
    </div>
  )
}

export default HomeRoute
