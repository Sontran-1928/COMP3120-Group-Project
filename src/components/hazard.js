import React from 'react'
import { useNavigate } from 'react-router-dom'

const Hazard = (props) => {
  const liveHazard = props // Collecting the properties

  // A workaround for displaying fields with actual values, when no value is present "No Change" is displayed
  let spdLmtActual = 0
  const noChangeLabel = 'No Change'

  const navigate = useNavigate()

  const navigateToMap = () => {
    navigate('/full-map', {
      state: {
        coordinates: liveHazard.coordinates
      }
    })
  }

  if (liveHazard.speedLimit !== -1) { // Checking against the speedLimit field, if -1 then we have dead value
    spdLmtActual = liveHazard.speedLimit
  } else {
    spdLmtActual = noChangeLabel
  }

  // Returning a HTML table row values for the HTML body
  return (
    <tr>
      <td>{liveHazard.id}</td>
      <td>{spdLmtActual}</td>
      <td>{liveHazard.adviceA}</td>
      <td>{liveHazard.adviceB}</td>
      <td>{liveHazard.adviceC}</td>
      <td>{liveHazard.incidentKind}</td>
      <td>{liveHazard.mainStreet}</td>
      <td><button onClick={navigateToMap}>Visit Map Location</button></td>
    </tr>
  )
}

export default Hazard
