import React, { Component, useState } from 'react';
import L from 'leaflet';
// postCSS import of Leaflet's CSS
import 'leaflet/dist/leaflet.css';
// using webpack json loader we can import our geojson file like this
import geojson from 'json!./bk_subway_entrances.geojson';
// import local components Filter and ForkMe
// import Overlay from './Overlay';

import DataPoint from './DataPoint';

const apiURL = 'https://waterservices.usgs.gov/nwis/iv/?format=json&siteStatus=all&sites=';

const sites = [
    { "siteId": "01304000", "coordinates": ["40.8499", "-73.22"] },
    { "siteId": "01304057", "coordinates": ["40.962", "-72.31"] },
    { "siteId": "01304250", "coordinates": ["40.9797", "-72.554"] },
    { "siteId": "01304500", "coordinates": ["40.914", "-72.69"] },
    { "siteId": "01304562", "coordinates": ["40.92", "-72.64"] },
    { "siteId": "01304650", "coordinates": ["41.044", "-72.32"] },
    // {"siteId": "01304705", "coordinates": ["40.933", "-72.144"]},
    { "siteId": "01304746", "coordinates": ["40.85", "-72.5"] },
    { "siteId": "01304920", "coordinates": ["40.8", "-72.75"] },
    { "siteId": "01305000", "coordinates": ["40.830", "-72.906"] },
    { "siteId": "01305500", "coordinates": ["40.77", "-72.994"] },
    { "siteId": "01305575", "coordinates": ["40.691", "-72.99"] },
    { "siteId": "01306402", "coordinates": ["40.72", "-73.09"] },
    { "siteId": "01306450", "coordinates": ["40.77", "-73.159"] },
    { "siteId": "01308000", "coordinates": ["40.704", "-73.31"] },
    { "siteId": "01309225", "coordinates": ["40.67", "-73.35"] },
    { "siteId": "403727073154503", "coordinates": ["40.624", "-73.26"] },
    { "siteId": "405149072532201", "coordinates": ["40.8637", "-72.88899"] },
    { "siteId": "405250073180801", "coordinates": ["40.880889", "-73.301"] }
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

function isGood(name, value) {
    if (name.includes("Temperature")) {
        return value > 16;
    }
    else if (name.includes("Specific conductance")) {
        return value < 10000;
    }
    else if (name.includes("Dissolved oxygen")) {
        return value > 6.5 && value < 8.5;
    }
    else if (name.includes("pH")) {
        return value > 6 && value < 8;
    }
    else if (name.includes("Turbidity")) {
        return value < 1.3;
    }
    else if (name.includes("Salinity")) {
        return true;
    }
    console.log("returning null");
    return null;
}

function popup_content() {
    let ret = ""
    navigator.geolocation.getCurrentPosition(function(position) {
    });
    return ret;
}

import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";

// store the map configuration properties in an object,
// we could also move this to a separate file & import it if desired.
let config = {};
config.params = {
    center: [40.7021817, -73.590436],
    zoomControl: false,
    zoom: 10,
    maxZoom: 19,
    minZoom: 7,
    scrollwheel: false,
    legends: true,
    infoControl: false,
    attributionControl: true
};
config.tileLayer = {
    uri: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    params: {
        minZoom: 7,
        id: '',
        accessToken: ''
    }
};

// array to store unique names of Brooklyn subway lines,
// this eventually gets passed down to the Filter component
let subwayLineNames = [];

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            map: null,
            tileLayer: null,
            geojsonLayer: null,
            geojson: null,
            subwayLinesFilter: '*',
            numEntrances: null
        };
        this._mapNode = null;
        this.updateMap = this.updateMap.bind(this);
        this.onEachFeature = this.onEachFeature.bind(this);
        this.pointToLayer = this.pointToLayer.bind(this);
        this.filterFeatures = this.filterFeatures.bind(this);
        this.filterGeoJSONLayer = this.filterGeoJSONLayer.bind(this);
    }

    componentDidMount() {
        // code to run just after the component "mounts" / DOM elements are created
        // we could make an AJAX request for the GeoJSON data here if it wasn't stored locally
        this.getData();
        // create the Leaflet map object
        if (!this.state.map) this.init(this._mapNode);

        // this.updatePosition(this.state.map);
    }

    updatePosition(map) {
        //NOTE: add the current location marker
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("added location marker")
            var latlng = new L.LatLng(position.coords.latitude, position.coords.longitude);
            var marker = L.circle(latlng, {
                color: 'white',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: 100
            }).addTo(map);
            map.panTo(latlng);


            let lat = position.coords.latitude
            let long = position.coords.longitude

            console.log("Latitude is:", lat);
            console.log("Longitude is:", long);

            let rating = "Unkown"
            let data = []
            let ret = ""
            if (lat != [] && long != []) {
                const site = getNearestSite(lat, long);

                console.log("Site", site);
                fetch(apiURL + site)
                    .then(response => {
                        // Check if the response is successful (status code 200)
                        if (!response.ok) {
                            throw new Error(`Request failed with status: ${response.status}`);
                        }
                        // Parse the response as JSON
                        return response.json();
                    })
                    .then(newData => {
                        // Do something with the JSON data returned by the API
                        console.log("New Data", newData);

                        if (newData != undefined) {

                            let goodCount = 0;
                            let totalCount = 0;
                            for (let v of newData.value.timeSeries) {
                                const name = v.variable.variableDescription;
                                const value = v.values[0].value[0].value;

                                if (parseFloat(value) < 0) {
                                    continue;
                                }

                                console.log("Name-value", name, value);
                                let good = isGood(name, value);

                                if (good == null) {
                                    continue;
                                }
                                else if (good == true) {
                                    goodCount++;
                                }

                                totalCount++;
                                data.push({ "name": name, "value": value, "good": good });
                            }
                            console.log(`good count: ${goodCount} total count: ${totalCount}`);
                            if (goodCount / totalCount >= .7) {
                                rating = "Good \uD83D\uDC4D"
                            }
                            else {
                                rating = "Bad \uD83D\uDC4E";
                            }
                        }

                        console.log("Set Data:", data);
                        console.log("Data.map: " + data.map(v => `<DataPoint key={${v.name}} data={${v}}></DataPoint>`));
                        ret = "<h3>Current Location</h3><p>Rating: " + rating + "</p>" + "<p>Latitude: " + lat + "</p>" + "<p>Longitude: " + long + "</p>" + data.map(v => `<DataPoint key={${v.name}} data={${v}}></DataPoint>`);




                        marker.bindPopup(ret).openPopup();
                    })
                    .catch(error => {
                        // Handle errors, such as network issues or invalid API responses
                        console.error('Error:', error);
                    });
            }


        }, function(error) {
            console.log(error);
        });
        console.log("updated position")
    }

    componentDidUpdate(prevProps, prevState) {
        // code to run when the component receives new props or state
        // check to see if geojson is stored, map is created, and geojson overlay needs to be added
        // if (this.state.geojson && this.state.map && !this.state.geojsonLayer) {
        //   // add the geojson overlay
        //   this.addGeoJSONLayer(this.state.geojson);
        // }


        // check to see if the subway lines filter has changed
        // if (this.state.subwayLinesFilter !== prevState.subwayLinesFilter) {
        //     // filter / re-render the geojson overlay
        //     this.filterGeoJSONLayer();
        // }
    }

    componentWillUnmount() {
        // code to run just before unmounting the component
        // this destroys the Leaflet map object & related event listeners
        this.state.map.remove();
    }

    getData() {
        // could also be an AJAX request that results in setting state with the geojson data
        // for simplicity sake we are just importing the geojson data using webpack's json loader
        this.setState({
            numEntrances: geojson.features.length,
            geojson
        });
    }

    updateMap(e) {
        let subwayLine = e.target.value;
        // change the subway line filter
        if (subwayLine === "All lines") {
            subwayLine = "*";
        }
        // update our state with the new filter value
        this.setState({
            subwayLinesFilter: subwayLine
        });

        // this.updatePosition(this.state.map);
    }

    addGeoJSONLayer(geojson) {
        // create a native Leaflet GeoJSON SVG Layer to add as an interactive overlay to the map
        // an options object is passed to define functions for customizing the layer
        const geojsonLayer = L.geoJson(geojson, {
            onEachFeature: this.onEachFeature,
            pointToLayer: this.pointToLayer,
            filter: this.filterFeatures
        });
        // add our GeoJSON layer to the Leaflet map object
        geojsonLayer.addTo(this.state.map);
        // store the Leaflet GeoJSON layer in our component state for use later
        this.setState({ geojsonLayer });
        // fit the geographic extent of the GeoJSON layer within the map's bounds / viewport
        this.zoomToFeature(geojsonLayer);
    }

    filterGeoJSONLayer() {
        // clear the geojson layer of its data
        this.state.geojsonLayer.clearLayers();
        // re-add the geojson so that it filters out subway lines which do not match state.filter
        this.state.geojsonLayer.addData(geojson);
        // fit the map to the new geojson layer's geographic extent
        this.zoomToFeature(this.state.geojsonLayer);
    }

    zoomToFeature(target) {
        // pad fitBounds() so features aren't hidden under the Filter UI element
        var fitBoundsParams = {
            paddingTopLeft: [200, 10],
            paddingBottomRight: [10, 10]
        };
        // set the map's center & zoom so that it fits the geographic extent of the layer
        this.state.map.fitBounds(target.getBounds(), fitBoundsParams);
    }

    filterFeatures(feature, layer) {
        // filter the subway entrances based on the map's current search filter
        // returns true only if the filter value matches the value of feature.properties.LINE
        const test = feature.properties.LINE.split('-').indexOf(this.state.subwayLinesFilter);
        if (this.state.subwayLinesFilter === '*' || test !== -1) {
            return true;
        }
    }

    pointToLayer(feature, latlng) {
        // renders our GeoJSON points as circle markers, rather than Leaflet's default image markers
        // parameters to style the GeoJSON markers
        var markerParams = {
            radius: 4,
            fillColor: 'orange',
            color: '#fff',
            weight: 1,
            opacity: 0.5,
            fillOpacity: 0.8
        };

        return L.circleMarker(latlng, markerParams);
    }

    onEachFeature(feature, layer) {
        if (feature.properties && feature.properties.NAME && feature.properties.LINE) {

            // if the array for unique subway line names has not been made, create it
            // there are 19 unique names total
            if (subwayLineNames.length < 19) {

                // add subway line name if it doesn't yet exist in the array
                feature.properties.LINE.split('-').forEach(function(line, index) {
                    if (subwayLineNames.indexOf(line) === -1) subwayLineNames.push(line);
                });

                // on the last GeoJSON feature
                if (this.state.geojson.features.indexOf(feature) === this.state.numEntrances - 1) {
                    // use sort() to put our values in alphanumeric order
                    subwayLineNames.sort();
                    // finally add a value to represent all of the subway lines
                    subwayLineNames.unshift('All lines');
                }
            }

            // assemble the HTML for the markers' popups (Leaflet's bindPopup method doesn't accept React JSX)
            const popupContent = `<h3>${feature.properties.NAME}</h3>
        <strong>Access to MTA lines: </strong>${feature.properties.LINE}`;

            // add our popups
            layer.bindPopup(popupContent);
        }
    }

    init(id) {
        if (this.state.map) return;
        // this function creates the Leaflet map object and is called after the Map component mounts
        let map = L.map(id, config.params);
        L.control.zoom({ position: "bottomleft" }).addTo(map);
        L.control.scale({ position: "bottomleft" }).addTo(map);

        // a TileLayer is used as the "basemap"
        const tileLayer = L.tileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(map);

        // set our state to include the tile layer
        this.setState({ map, tileLayer });

        this.updatePosition(map)
    }

    render() {
        return (
            <div id="mapUI">
                <div ref={(node) => this._mapNode = node} id="map" />
            </div>
        );
    }
}

export default Map;
