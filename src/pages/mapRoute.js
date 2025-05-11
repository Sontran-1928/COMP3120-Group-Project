import React from 'react'
import Openlayers from '../openlayers'

const MapRoute = () => {
  // Returning HTML to house, format and display a page for the Openlayers map
  return (
    <div>
      <h2>Full Map</h2>
      <div>
        <Openlayers />
      </div>
    </div>
  )
}

export default MapRoute
