import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'

const Price = () => {
  // Setting up useStates for tracking values
  const [prices, setPrices] = useState([])
  const [fuelName, setFuelName] = useState([])

  // Get station ID from navigate state
  const stationID = useLocation().state.stationID
  const URL = '/api/'
  useEffect(() => {
    if (fuelName.length < 1) {
      fetchFuelName()
      fetchPrices(stationID)
    }
  }, [prices, fuelName, stationID])

  // filter for station code
  function filterName (code) {
    const name = fuelName.filter((f) => f.code === code)
    if (name[0]) {
      return name[0].name
    } else {
      return 'Unavailable'
    }
  }

  // Axios .get for grabbing station specific fuel prices
  const fetchPrices = (id) => {
    axios.get(URL + 'fuel/prices/station/' + id, {
      headers: {
        apikey: process.env.REACT_APP_API_KEY
      }
    })
      .then((response) => {
        setPrices(response.data.prices)
      })
  }

  // Axios .get for geting names of fuel types
  const fetchFuelName = () => {
    axios.get(URL + 'fuel/lovs', {
      headers: {
        apikey: process.env.REACT_APP_API_KEY
      }
    })
      .then((response) => {
        setFuelName(response.data.fueltypes.items)
      })
  }

  // Returning a HTML unordered list populated with a .map function
  return (
    <div>
      {prices.map((p) => <ul key={p.fueltype}>
        <li>💲 <b>Fuel:</b> {filterName(p.fueltype)} <b>Price:</b> {p.price}c/L</li>
                         </ul>)}
    </div>
  )
}

export default Price
