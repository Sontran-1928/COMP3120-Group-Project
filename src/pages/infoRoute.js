import React from 'react'

const InfoRoute = () => {
  // A Full text page for information about fuel and some labeling used throughout the site
  return (
    <div>
      <div>
        <table><caption><h2>Petrol</h2></caption>
          <thead>
            <tr>
              <th>Ethanol 94 (E10)</th>
              <td>A fuel blend of unleaded petrol and ethanol with an octane rating of 94. Ethanol is a biofuel that comes from fermenting plants such as wheat and sugar cane.
                The name E10 means the fuel is 10% ethanol and 90% petrol. Most cars on the road today can use E10.
              </td>
            </tr>
            <tr>
              <th>Premium 98</th>
              <td>Premium unleaded petrol with an octane rating of 98</td>
            </tr>
            <tr>
              <th>Unleaded 91</th>
              <td>Standard unleaded petrol with an octane rating of 91</td>
            </tr>
            <tr>
              <th>Premium 95</th>
              <td>Premium unleaded petrol with an octane rating of 95</td>
            </tr>
            <tr>
              <th>Ethanol 105 (E85)</th>
              <td>A fuel blend of 70% to 85% ethanol and unleaded petrol and with an octane rating of 105.
                It can only be used in cars that have been specifically built or modified to use it, including flexible-fuel vehicles and V8 racing supercars.
              </td>
            </tr>
          </thead>
        </table>
      </div>
      <div>
        <table><caption><h2>Diesel</h2></caption>
          <thead>
            <tr>
              <th>Diesel</th>
              <td>A fuel that is used in diesel engines and is also known as distillate.</td>
            </tr>
            <tr>
              <th>Premium Diesel</th>
              <td>A diesel fuel, usually with additives designed to improve efficiency or clean the engine.</td>
            </tr>
            <tr>
              <th>Biodiesel 20</th>
              <td>A blend of 20 percent ‘bio’, often made from vegetable oil, and diesel fuel. Most diesel engines can run on biodiesel, refer to your equipment or vehicle manufacturer for confirmation.</td>
            </tr>
          </thead>
        </table>
      </div>
      <div>
        <table><caption><h2>Other</h2></caption>
          <thead>
            <tr>
              <th>LPG</th>
              <td>Liquefied petroleum gas is a flammable mixture of hydrocarbon gasses made from fossil fuel sources. Also referred to as autogas and only to be used in engines modified to use gas.</td>
            </tr>
            <tr>
              <th>CNG/NGV</th>
              <td>Compressed natural gas.</td>
            </tr>
            <tr>
              <th>EV charge</th>
              <td>Electric vehicle charging station, only for use in electric cars.</td>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  )
}

export default InfoRoute
