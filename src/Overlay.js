import React, { useEffect, useState } from 'react';

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
