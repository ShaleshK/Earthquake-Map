var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});
var tectonicPlates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();
var map = L.map("map", {
  center: [41.87, -87.63],
  zoom: 3,
  layers: [earthquakes, tectonicPlates]  
});
lightmap.addTo(map);
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createEqMarkers);

function createEqMarkers(response) {
  L.geoJSON(response, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    }, style: styleInfo,
    onEachFeature: onEachFeature
  }).addTo(earthquakes);
}
earthquakes.addTo(map);
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_steps.json", tectonicMarkers);
function tectonicMarkers(response) {
L.geoJSON(response, {
  color: "orange",
  weight: 2
}).addTo(tectonicPlates);}
tectonicPlates.addTo(map);

var legend = L.control({
  position: "bottomright"
});
legend.onAdd = function () {
  var div = L.DomUtil.create("div", "info legend");
  var grades = [0, 1, 2, 3, 4, 5];
  var colors = ["#98EE00", "#D4EE00", "#EECC00", "#EE9C00", "#EA822C", "#EA2C2C"];
  for (var i = 0; i < grades.length; i++) { 
    div.innerHTML += 
    "<i style='background: " + colors[i] + "'></i> " + 
    grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+"); 
  } 
  return div;
};

legend.addTo(map);
function styleInfo(feature) {
  return {
    radius: getRadius(feature.properties.mag),
    fillColor: getColor(feature.properties.mag),
    color: "#000000",
    weight: 0.5,
    opacity: 1,
    fillOpacity: 1,
    stroke: true
  };
}
function onEachFeature(feature, layer) {
  layer.bindPopup("magnitude:" + feature.properties.mag + "<br>location:" + feature.properties.place)
}
function getColor(magnitude) {
  if (magnitude > 5) {
    return "#EA2C2C"
  }
  else if (magnitude > 4) {
    return "#EA822C"
  }
  else if (magnitude > 3) {
    return "#EE9C00"
  }
  else if (magnitude > 2) {
    return "#EECC00"
  }
  else if (magnitude > 1) {
    return "#D4EE00"
  }
  else {
    return "#98EE00"
  }
}
function getRadius(magnitude) {
  if (magnitude === 0) {
    return 1
  }
  return magnitude * 4
}
// function createMap(earthquakes) {

//   // Create the tile layer that will be the background of our map


//   // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
//   //     L.control.layers(baseMaps, overlayMaps, {
//   //       collapsed: false
//   //     }).addTo(map);
//   // }
//   function createMarkers(response) {

//     // Pull the "stations" property off of response.data
//     var id = response.features.id;

//     // Initialize an array to hold bike markers
//     var eqMarkers = [];

//     // Loop through the stations array
//     for (var index = 0; index < response.metadata.count; index++) {
//       // var id = id[index];
//       // For each station, create a marker and bind a popup with the station's name
//       var myIcon = L.ExtraMarkers.icon({
//         icon: "ion-settings",
//         iconColor: "white",
//         markerColor: "yellow",
//         shape: "star"
//       })
//       var eqMarker = L.marker([response.features[index].geometry.coordinates[1], response.features[index].geometry.coordinates[0]], { icon: myIcon })
//         .bindPopup("<h3>" + response.features[index].properties.place + "<h3><h3>Capacity: " + response.features[index].properties.mag + "<h3>");

//       // Add the marker to the bikeMarkers array
//       eqMarkers.push(eqMarker);
//     }

//     // Create a layer group made from the bike markers array, pass it into the createMap function
//     createMap(L.layerGroup(eqMarkers));
  }
  