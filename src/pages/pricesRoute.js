import React from 'react'
import Price from '../components/price'

const PricesRoute = ({ stationID }) => {
  // Simple react route with HTML to return a display of prices
  return (
    <div>
      <Price stationID={stationID} />
    </div>
  )
}

export default PricesRoute
