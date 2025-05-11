import React, { useState } from 'react'
import axios from 'axios'

const SearchByStation = () => {
  // Creating an initialstate to outline the shape of the object for the useState
  const initialstate = { fueltype: '', prices: [], lastupdated: '' }

  // Setting up the useStates
  const [searchStation, setSearchStation] = useState('')
  const [stationPrice, setStationPrice] = useState(initialstate)

  const URL = '/api/'
  // onChange component to populate setSearchLocation with the input text from the form
  const handleChange = (event) => {
    event.preventDefault()
    setSearchStation(event.target.value)
  }

  /*
  This formHandler component takes the searchStation grabbed from the form and then checks for length, then tacks
  on the value to the end of a Axios .get call where the API End Point queries the server and grabs the collection of
  fuel prices to be displayed
  */
  const formHandler = (event) => {
    event.preventDefault()
    if (searchStation.length > 0) {
      axios.get(URL + 'fuel/prices/station/' + searchStation, {
        headers: {
          apikey: process.env.REACT_APP_API_KEY
        }
      })
        .then((response) => {
          setStationPrice(response.data)
        })
    }
  }
  /*
  This return block comprises of a search field form and a table to display the filtered data
  on the stationPrice object we've used the "?" syntax to check that the object is defined first
  before mapping otherwise the site may break on loading.
  */
  return (
    <>
      <div className='Search-By-Station'>
        <form onSubmit={formHandler}>
          <label htmlFor='searchStation'>Search for a specific station</label>
          <input
            type='number'
            id='searchStation'
            placeholder='Enter Station Code'
            onChange={handleChange}
            value={searchStation}
          />
          <button type='submit'>Search</button>
        </form>
      </div>
      {/* Using the "?" to check the object is defined before use */}
      {stationPrice
        ? (
          <div className='Searched-Fuels'>
            <ul>
              {stationPrice?.prices.map((p) => (
                <li key={p.fueltype}>
                  <b>{p.fueltype}</b>: {p.price}c per litre
                </li>
              ))}
            </ul>
          </div>
          )
        : (
          <div>Loading</div>
          )}
    </>
  )
}

export default SearchByStation
