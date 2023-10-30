import React, { useState } from 'react';

// the UI component for filtering the subway entrances by subway line
export default (props) => {
  // const { location, setLocation } = props;
  const [location, setLocation] = useState('Jeff');

  // this is the JSX that will become the Filter UI in the DOM, notice it looks pretty similar to HTML
  // notice in the select element onChange is set to the updateFilter method
  // thus when a user selects a new subway line to view, the component passes the new filter value
  // to the parent component, Map, which reloads the GeoJSON data with the current filter value
  return (
    <div className="filterSubwayLines">
      <hr/>
      <h3>Location</h3>
      <p>{location}</p>
      <input type='text' value={location} onChange={setLocation}></input>      
    </div>
  );
};
