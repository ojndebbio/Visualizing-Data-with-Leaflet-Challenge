
var map = L.map("map", {
    center: [40, -111],
    zoom: 4
  });
  
  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  }).addTo(map);
  
  var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Function that will determine the color of a neighborhood based on the borough it belongs to
  function chooseColor(a) {
      switch (true){
      case (a > 0) && (a <= 1):
        return "#FFFF44";
      case (a > 1) && (a <= 2):
        return "#FFDD00";
      case (a > 2) && (a <= 3):
        return "#FFAA00";
      case (a > 3) && (a <= 4):
        return "#FF5500";
      case (a > 4) && (a <= 5):
        return "#AA2200";
      case (a >  5):
        return "#770000";
      };
  };
  
  d3.json(link, function(data) {
  
     function onEachFeature(feature, layer) {
      var popupContent = "<h3>" + feature.properties.place+"</h3><h2>"+feature.properties.mag+" magnitude</h2>";
      
      if (feature.properties && feature.properties.popupContent) {
        popupContent += feature.properties.popupContent;
      }
      layer.bindPopup(popupContent);
      //console.log(feature)
     };
  
     L.geoJSON(data, {
  
      style: function (feature) {
        return feature.properties && feature.properties.style;
      },
  
      onEachFeature: onEachFeature,
  
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: feature.properties.mag * 4.5,
          fillColor: chooseColor(feature.properties.mag),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: .6 + feature.properties.mag/10
        });
      }
    }).addTo(map);
  
  
    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = [0,1,2,3,4,5]
      var colors = ["#FFFF44", "#FFDD00","#FFAA00","#FF5500","#AA2200","#770000"]
      var labels = ['0-1','1-2','2-3','3-4','4-5','5+'];
  
      // Add min & max
      var legendInfo = "<h2>Magnitude</h2>"
  
      div.innerHTML = legendInfo;
  
      limits.forEach(function(limit, index) {
        div.innerHTML += "<li style=\"background-color: " + colors[index] + "\">"+labels[index]+"</li>"
      });
      return div;
    };
  
    // Adding legend to the map
    legend.addTo(map);
  
  
  });

