import Map from 'ol/Map.js'
import OSM from 'ol/source/OSM.js'
import TileLayer from 'ol/layer/Tile.js'
import View from 'ol/View.js'
import { defaults } from 'ol/control/defaults'
import Feature from 'ol/Feature.js'
import VectorSource from 'ol/source/Vector.js'
import VectorLayer from 'ol/layer/Vector'
import Point from 'ol/geom/Point.js'
import React, { useState, useEffect, useRef } from 'react'
import { transform } from 'ol/proj'
import Style from 'ol/style/Style.js'
import Icon from 'ol/style/Icon.js'
import axios from 'axios'
import Popup from 'ol-popup/src/ol-popup.js'
import { useLocation } from 'react-router-dom'

const CreateMap = () => {
  const [newMap, setNewMap] = useState()

  const [fuelType, setFuelType] = useState([])

  // useRef is used to access the element in the DOM
  const mapElement = useRef()
  const mapRef = useRef()
  mapRef.current = newMap

  const URL = '/api/'
  const location = useLocation()

  useEffect(() => {
    // if statement is used to prevent infinite loop.
    if (fuelType.length < 1) {
      fetchFuelType()
    }

    let viewObj = ''
    // Set default focus view to the Sydney Opera House.
    viewObj = new View({
      projection: 'EPSG:3857',
      center: transform([151.2156391455, -33.85722574534], 'EPSG:4326', 'EPSG:3857'),
      zoom: 18,
      minZoom: 0,
      maxZoom: 20
    })

    // If the page transition was from user clicking on "visit map location" button then the openlayers will be provided with a coordinates.
    // Focus map on that coordinates instead.
    if (location.state) {
      const focusCoord = location.state.coordinates
      viewObj = new View({
        projection: 'EPSG:3857',
        center: transform([focusCoord[0], focusCoord[1]], 'EPSG:4326', 'EPSG:3857'),
        zoom: 18,
        minZoom: 0,
        maxZoom: 20
      })
    }

    // Create the map object
    const map = new Map({
      target: mapElement.current,
      // Disable the map control
      controls: defaults({ attribution: false }),

      // Create the map layers (marker, map tile, etc...)
      layers: [
        new TileLayer({
          // OSM stands for OpenStreetMap
          source: new OSM()
        })
      ],

      // Create the view of the map using viewObj, essentially will tell where to focus on load.
      view: viewObj
    })

    // Create a simple marker placeholder.
    const fuelStationMarker = new VectorLayer({
      source: new VectorSource({
        features: []
        // features: featureSet
      })
    })

    const trafficHazardMarker = new VectorLayer({
      source: new VectorSource({
        features: []
      })
    })

    // Openlayers uses a custom Style method to use image/icon as marker.
    const fuelIconStyle = new Style({
      image: new Icon({
        // src: 'fuel_icon.png'
        src: 'https://static-00.iconduck.com/assets.00/petrol-station-icon-2048x2048-pxkgfnkc.png',
        width: 25,
        height: 25,
        opacity: 0.70
      })
    })

    const trafficHazardStyle = new Style({
      image: new Icon({
        src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS90ESgOT8j_AXKmrPmQPVsxeCCqIp5FQ3vGA&usqp=CAU',
        width: 28,
        height: 25
      })
    })

    // Use the server to fetch all the stations using axios and add marker to those locations.
    // Add additional data such as name and brand for popup uses.
    axios.get(URL + 'fuel/lovs', {
      headers: {
        apikey: process.env.REACTAPPAPIKEY
      }
    })
      .then((response) => {
        for (let i = 0; i < response.data.stations.items.length; i++) {
          const stationData = response.data.stations.items[i]
          fuelStationMarker.getSource().addFeature(createFuelStationMarker(stationData))
        }
      })

    // Set icon for both marker
    fuelStationMarker.setStyle(fuelIconStyle)
    trafficHazardMarker.setStyle(trafficHazardStyle)

    // Use the server to fetch all the traffic hazards locations.
    // Add additional data such as street name, type, advices and more for popup uses.
    axios.get(URL + 'regional-lga-incident/open', {
      headers: {
        apikey: process.env.REACTAPPAPIKEY
      }
    })
      .then((response) => {
        for (let o = 0; o < response.data.features.length; o++) {
          const hazardData = response.data.features[o]
          trafficHazardMarker.getSource().addFeature(createHazardMarker(hazardData))
        }
      })

    // Set the name for the two type of markers for easier accessibility later on.
    fuelStationMarker.set('name', 'Fuel Station Marker')
    trafficHazardMarker.set('name', 'Traffic Hazard Marker')

    // Add the marker to a new layer within the map.
    map.addLayer(fuelStationMarker)
    map.addLayer(trafficHazardMarker)

    // Create the popup layer and add it to the map.
    const popup = new Popup()
    map.addOverlay(popup)

    // Separate on click function to display popup at markers.
    map.on('click', (event) => {
      // checkFeature attempt to get features at the pixel which the user click on the map.
      const checkFeature = map.getFeaturesAtPixel(event.pixel)

      // Check if there's a feature or not at checkFeature by using checking its length.
      if (checkFeature.length > 0) {
        // If there's a feature, then check for its type.
        if (checkFeature[0].get('type') === 'Fuel Station') {
          // Get the price whenever the user press on a marker for popup
          axios.get(URL + 'fuel/prices/station/' + checkFeature[0].get('code'), {
            headers: {
              apikey: process.env.REACTAPPAPIKEY
            }
          })
            .then((response) => {
              // Convert data to HTML content
              let displayData = `<b>Station Name:</b> ${checkFeature[0].get('name')}
                                            <br/>
                                            <b>Brand:</b> ${checkFeature[0].get('brand')}
                                            <br/>
                                            <b>Address:</b> ${checkFeature[0].get('address')}
                                            <hr style="margin:15px 10px 10px 10px"/>
                                            <b>Available Fuels:</b>
                                            <br/>`

              const availPrice = response.data.prices
              if (availPrice.length > 0) {
                for (let i = 0; i < availPrice.length; i++) {
                  const matchFuel = fuelType.filter((f) => availPrice[i].fueltype === f.code)
                  displayData += `${matchFuel[0].name} : ${availPrice[i].price} c/L <br/>`
                }
              } else {
                displayData += '<p>No fuels are sold here!</p>'
              }

              // Display the popup at the event coordinate with its information such as brand and name
              popup.show(event.coordinate, displayData)
            })
        } else if (checkFeature[0].get('type') === 'Hazard') {
          // If type is hazard, display its information
          let displayData = `<b>Hazard Type: </b> ${checkFeature[0].get('displayName')}
                                        </br>
                                        <p><b>Main Street affected:</b> ${checkFeature[0].get('street')}</p>
                                        <hr style="margin:10px"/>`

          // Get all the features' key names
          const allKeys = checkFeature[0].getKeys()
          for (let i = 0; i < allKeys.length; i++) {
            //
            if (allKeys[i].includes('Advice')) {
              if (checkFeature[0].get(allKeys[i]).length > 1) {
                displayData += `<b>${allKeys[i]}: </b>${checkFeature[0].get(allKeys[i])} <br/>`
              }
            } else if (allKeys[i].includes('Speed Limit')) {
              if (checkFeature[0].get(allKeys[i]) === -1) {
                displayData += `<b>${allKeys[i]}: </b>No Change`
              } else {
                displayData += `<b>${allKeys[i]}: </b>${checkFeature[0].get(allKeys[i])}`
              }
            }
          }

          // Display the popup at the event coordinate with its information such as hazard type, advices, speed limit, etc.
          popup.show(event.coordinate, displayData)
        }
      } else {
        // Hide the popup when click outside of the popup box when one is being currently displayed.
        popup.hide()
      }
    })
    setNewMap(map)

    /* Set the map target to an empty string or undefined,
         * which represents a nonexistent HTML element ID. This will
         * prevent the app from rendering multiple maps. */
    return () => map.setTarget('')
  }, [fuelType, location.state])

  // Fetch all fuel types using backend.
  const fetchFuelType = () => {
    axios.get(URL + 'fuel/lovs', {
      headers: {
        apikey: process.env.REACTAPPAPIKEY
      }
    })
      .then((response) => {
        setFuelType(response.data.fueltypes.items)
      })
  }

  // A simple function that returns a Feature using the coordinates as parameters
  // For a fuelstation, add station data.
  function createFuelStationMarker (stationData) {
    const stationCoord = [stationData.location.longitude, stationData.location.latitude]
    return new Feature({
      geometry: new Point(transform(stationCoord, 'EPSG:4326', 'EPSG:3857')),
      type: 'Fuel Station',
      name: stationData.name,
      brand: stationData.brand,
      code: stationData.code,
      address: stationData.address
    })
  }

  // A simple function that returns a Feature using the coordinates as parameters
  // For a fuelstation, add hazard data.
  function createHazardMarker (hazardData) {
    const hazardCoord = hazardData.geometry.coordinates
    const hazardProperties = hazardData.properties
    // console.log(hazardProperties)
    return new Feature({
      geometry: new Point(transform(hazardCoord, 'EPSG:4326', 'EPSG:3857')),
      type: 'Hazard',
      displayName: hazardProperties.displayName,
      street: hazardProperties.roads[0].mainStreet,
      'Advice A': hazardProperties.adviceA,
      'Advice B': hazardProperties.adviceB,
      'Advice C': hazardProperties.adviceC,
      'Speed Limit': hazardProperties.speedLimit
    })
  }

  // A simple function which enable/disable the markers.
  const handleMarkerChange = (name) => {
    const curLayer = mapRef.current.getLayers().getArray().find(layer => layer.get('name') === name)
    if (curLayer.isVisible()) {
      curLayer.setVisible(false)
    } else {
      curLayer.setVisible(true)
    }
  }

  return (
    <div>
      <div ref={mapElement} className='map-container' />

      <div className='container'>
        Enable Fuel Station Markers:
        <input className='inputCheckBox' type='checkbox' defaultChecked onChange={() => handleMarkerChange('Fuel Station Marker')} />
      </div>
      <div className='container'>
        Enable Traffic Hazard Markers:
        <input className='inputCheckBox' type='checkbox' defaultChecked onChange={() => handleMarkerChange('Traffic Hazard Marker')} />
      </div>
      <br />
    </div>
  )
}

export default CreateMap
