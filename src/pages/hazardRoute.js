import React from 'react'
import Hazard from '../components/hazard'

const HazardRoute = ({ hazards }) => {
  // Returning the main table components and mapping the hazard properties to the Hazard component to be processed
  return (
    <div className='Hazard-list'>
      <table><caption><h2>Hazards ⚠</h2></caption>
        <thead>
          <tr>
            <th>Hazard ID </th>
            <th>Speed Limit </th>
            <th>Advice A </th>
            <th>Advice B </th>
            <th>Advice C </th>
            <th>Incident Kind </th>
            <th>Main Street</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapping all the relevant Hazard properties to the Hazard component to be further processed */}
          {hazards.map((h) => <Hazard
            key={h.id} id={h.id} speedLimit={h.properties.speedLimit}
            adviceA={h.properties.adviceA} adviceB={h.properties.adviceB} adviceC={h.properties.adviceC} incidentKind={h.properties.incidentKind}
            mainStreet={h.properties.roads[0].mainStreet} coordinates={h.geometry.coordinates}
                              />)}
        </tbody>
      </table>
    </div>
  )
}

export default HazardRoute
