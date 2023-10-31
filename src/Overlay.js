import React, { useEffect, useState } from 'react';

const sites = [
  {"siteId": "01304000", "coordinates": ["40.8499", "-73.22"]},
  {"siteId": "01304057", "coordinates": ["40.962", "-72.31"]},
  {"siteId": "01304250", "coordinates": ["40.9797", "-72.554"]},
  {"siteId": "01304500", "coordinates": ["40.914", "-72.69"]},
  {"siteId": "01304562", "coordinates": ["40.92", "-72.64"]},
  {"siteId": "01304650", "coordinates": ["41.044", "-72.32"]},
  {"siteId": "01304705", "coordinates": ["40.933", "-72.144"]},
  {"siteId": "01304746", "coordinates": ["40.85", "-72.5"]},
  {"siteId": "01304920", "coordinates": ["40.8", "-72.75"]},
  {"siteId": "01305000", "coordinates": ["40.830", "-72.906"]},
  {"siteId": "01305500", "coordinates": ["40.77", "-72.994"]},
  {"siteId": "01305575", "coordinates": ["40.691", "-72.99"]},
  {"siteId": "01306402", "coordinates": ["40.72", "-73.09"]},
  {"siteId": "01306450", "coordinates": ["40.77", "-73.159"]},
  {"siteId": "01308000", "coordinates": ["40.704", "-73.31"]},
  {"siteId": "01309225", "coordinates": ["40.67", "-73.35"]},
  {"siteId": "403727073154503", "coordinates": ["40.624", "-73.26"]},
  {"siteId": "405149072532201", "coordinates": ["40.8637", "-72.88899"]},
  {"siteId": "405250073180801", "coordinates": ["40.880889", "-73.301"]}
];

function getSquaredDistance(lat1, long1, lat2, long2) {
  return Math.pow(lat2 - lat1, 2) + Math.pow(long2 - long1, 2);
}

function getNearestSite(lat, long) {
  let smallestDistance = getSquaredDistance(lat, sites[0]["coordinates"][0], long, sites[0]["coordinates"][1]);
  let smallestSite = sites[0]["siteId"];

  for (let i in sites) {
    const dist = getSquaredDistance(lat, sites[i]["coordinates"][0], long, sites[i]["coordinates"][1]);
    if (smallestDistance > dist) {
      smallestDistance = dist;
      smallestSite = sites[i]["siteId"];
    }
  }

  return smallestSite;
}

// the UI component for filtering the subway entrances by subway line
export default (props) => {
  const [location, setLocation] = useState("");

  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
    });

    console.log("Latitude is:", lat);
    console.log("Longitude is:", long);

    if (lat != [] && long != []) {
      const site = getNearestSite(lat, long);

      setLocation(site);
    }
  }, [lat, long]);

  function getPosition() {
    navigator.geolocation.getCurrentPosition(function(position) {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
    });

    console.log("Latitude is:", lat);
    console.log("Longitude is:", long);
  }

  // this is the JSX that will become the Filter UI in the DOM, notice it looks pretty similar to HTML
  // notice in the select element onChange is set to the updateFilter method
  // thus when a user selects a new subway line to view, the component passes the new filter value
  // to the parent component, Map, which reloads the GeoJSON data with the current filter value
  return (
    <div className="filterSubwayLines">
      <hr/>
      <h3>Location</h3>
      <p>{lat}, {long}</p>
      <input type='text' value={location} onChange={(val) => setLocation(val.currentTarget.value)}></input>
      <button onClick={getPosition}>Get Current Position</button>     
    </div>
  );
};
