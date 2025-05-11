import React from "react";
import Station from "../components/station";

const StationRoute = ({ stations }) => {
  // Returning a HTML table for the collection of stations. Also implementing the "?" to check data is defined before attempting to .map the properties to the Station component
  return stations ? (
    <div className="Station-list">
      <table>
        <caption>
          <h2>Stations ⛽</h2>
        </caption>
        <thead>
          <tr>
            <th>Station ID </th>
            <th>Brand </th>
            <th>Name </th>
            <th>Address </th>
            <th>Select</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapping the relevant properties of the stations to the Station component*/}
          {stations.map((s) => (
            <Station
              key={s.code}
              id={s.code}
              brand={s.brand}
              name={s.name}
              address={s.address}
              coordinates={s.location}
            ></Station>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div>Loading</div>
  );
};

export default StationRoute;
