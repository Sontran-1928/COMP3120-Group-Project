import React from 'react'
import { useNavigate } from 'react-router-dom'

const Station = (props) => {
  const liveStation = props // Collecting the properties
  // Setting up useNavigate hook to handle a page change when the button is clicked
  const navigate = useNavigate()

  // Page shift to fuel price page, which will display all the available fuels and their price at this location.
  // Add "state" parameter to bring the station ID to fuel price page.
  const navigateToPrices = () => {
    navigate('/prices', {
      state: {
        stationID: liveStation.id
      }
    })
  }

  // Page shift to full-map and a locking in coords for the map to view specific station
  // Add "state" parameter to bring the coordinates to the full-map.
  const navigateToMap = () => {
    const stationCoord = [liveStation.coordinates.longitude, liveStation.coordinates.latitude]
    navigate('/full-map', {
      state: {
        coordinates: stationCoord
      }
    })
  }

  // Returning table row data for the table in stationRoute.js
  return (
    <tr>
      <td>{liveStation.id}</td>
      <td>{liveStation.brand}</td>
      <td>{liveStation.name}</td>
      <td>{liveStation.address}</td>
      {/* Setting up buttons to display prices or shift to a map point */}
      <td><button onClick={navigateToPrices}>Available Price</button></td>
      <td><button onClick={navigateToMap}>Visit Map Location</button></td>
    </tr>
  )
}

export default Station
