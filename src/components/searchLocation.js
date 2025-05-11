import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'

const SearchByLocation = () => {
  // Setup of useStates to house the data
  const [searchLocation, setSearchLocation] = useState('')
  const [stationList, setStationList] = useState('')
  const navigate = useNavigate()
  const URL = '/api/'

  // onChange component to populate setSearchLocation with the input text from the form
  const handleChange = (event) => {
    event.preventDefault()
    setSearchLocation(event.target.value)
  }

  // Page shift to fuel price page, which will display all the available fuels and their price at this location.
  // Add "state" parameter to bring the station ID to fuel price page.
  const navigateToPrices = (code) => {
    navigate('/prices', {
      state: {
        stationID: code
      }
    })
  }

  // Page shift to full-map and a locking in coords for the map to view specific station
  // Add "state" parameter to bring the coordinates to the full-map.
  const navigateToMap = (data) => {
    const stationCoordinates = [data.longitude, data.latitude]
    navigate('/full-map', {
      state: {
        coordinates: stationCoordinates
      }
    })
  }

  /*
    This formHandler component takes the searchLocation grabbed from the form and then checks for length, then tacks
    on the value to the end of a Axios .get call where the API End Point queries the server and filters the collection
    by the input and fills the StationList to be displayed
    */
  const formHandler = (event) => {
    event.preventDefault()
    if (searchLocation.length > 0) {
      axios.get(URL + 'fuel/location/' + searchLocation, {
        headers: {
          apikey: process.env.REACT_APP_API_KEY
        }
      })
        .then((response) => {
          setStationList(response.data)
        })
    }
  }

  /*
    This return block comprises of a search field form and a table to display the filtered data
    on the stationList object we've used the "?" syntax to check that the object is defined first
    before mapping otherwise the site may break on loading.
    */
  return (
    <>
      <div className='Search-By-Location'>
        <form onSubmit={formHandler}>
          <label htmlFor='searchLocation'>Search by location</label>
          <input
            type='text'
            id='searchLocation'
            placeholder='Enter postcode or suburb'
            onChange={handleChange}
            value={searchLocation}
          />
          <button type='submit'>Search</button>
        </form>
      </div>
      {/* Using the "?" to check the object is defined before use */}
      {stationList ? (
        <div className='Searched-Stations'>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Brand</th>
                <th>Name</th>
                <th>Address</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {stationList?.map((s) => (
                <tr key={s.code}>
                  <td>{s.code}</td>
                  <td>{s.brand}</td>
                  <td>{s.name} </td>
                  <td>{s.address}</td>
                  {/* Setting up buttons to display prices or shift to a map point */}
                  <td><button onClick={() => navigateToPrices(s.code)}>Available Price</button></td>
                  <td><button onClick={() => navigateToMap(s.location)}>Visit Map Location</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div />
      )}
    </>
  )
}

export default SearchByLocation
