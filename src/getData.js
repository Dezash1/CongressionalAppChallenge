const fetch = require('node-fetch');
const apiURL = 'https://waterservices.usgs.gov/nwis/iv/?format=json&siteStatus=all&sites=';

var mysite = "USGS:01305575";
function getDataFromSites(site) {
  let customURL = apiURL + site;
  let json = getJSON(customURL);
  console.log(json.nil);
}

function getJSON(site) {
  fetch(customURL)
    .then(response => {
      // Check if the response is successful (status code 200)
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
      // Parse the response as JSON
      return response.json();
    })
    .then(data => {
      // Do something with the JSON data returned by the API
      console.log(data);
    })
    .catch(error => {
      // Handle errors, such as network issues or invalid API responses
      console.error('Error:', error);
    });
}



getDataFromSites(mysite);
