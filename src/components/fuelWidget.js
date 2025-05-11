import React from 'react'

const FuelWidget = ({ widgetPrices }) => {
  // Initialising variables to house the filtered collections
  let E10
  let U91
  let P98
  let DL

  // Gathering the relevant components of collection E10
  E10 = widgetPrices.filter((price) => price.fueltype === 'E10')
  // Setting up variables for the average calculation
  let E10total = 0
  let E10count = 0
  let E10average = 0

  // A for loop to traverse the collection and add all price values for average
  for (let index = 0; index < E10.length; index++) {
    E10total = E10total + E10[index].price
  }
  E10count = E10.length
  E10average = E10total / E10count
  const E10fix = E10average.toFixed(2) // Making the number relevant to 2 decimal places

  // This formula repeats itself for the next three values
  // Unleaded 91
  U91 = widgetPrices.filter((price) => price.fueltype === 'U91')

  let U91total = 0
  let U91count = 0
  let U91average = 0

  for (let index = 0; index < U91.length; index++) {
    U91total = U91total + U91[index].price
  }
  U91count = E10.length
  U91average = U91total / U91count
  const U91fix = U91average.toFixed(2)

  // This formula repeats itself
  // Premium 98
  P98 = widgetPrices.filter((price) => price.fueltype === 'P98')

  let P98total = 0
  let P98count = 0
  let P98average = 0

  for (let index = 0; index < P98.length; index++) {
    P98total = P98total + P98[index].price
  }
  P98count = E10.length
  P98average = P98total / P98count
  const P98fix = P98average.toFixed(2)

  // This formula repeats itself
  // Regular Diesel
  DL = widgetPrices.filter((price) => price.fueltype === 'DL')

  let DLtotal = 0
  let DLcount = 0
  let DLaverage = 0

  for (let index = 0; index < DL.length; index++) {
    DLtotal = DLtotal + DL[index].price
  }
  DLcount = E10.length
  DLaverage = DLtotal / DLcount
  const DLfix = DLaverage.toFixed(2)

  // Returning a HTML table with the relevant values
  return (
    <div className='Fuel-Widget'>
      <table>
        <caption>
          <h2>Today's Averages</h2>
        </caption>
        <thead>
          <tr>
            <th>Ethanol 94 - E10</th>
            <th>Unleaded 91 - U91</th>
            <th>Premium 98 - P98</th>
            <th>Diesel - DL </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{E10fix}c/L</td>
            <td>{U91fix}c/L</td>
            <td>{P98fix}c/L</td>
            <td>{DLfix}c/L</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default FuelWidget
