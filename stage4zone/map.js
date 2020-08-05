
// HTML Geolocation API 
const geo = navigator.geolocation;
// check if geolocation is supported 
if (geo) {
    // geolocation is supported

    //Ask user for permission to user their location. 
    geo.getCurrentPosition(success, failure);
} else {
    //geolocation not supported
}


function success(position) {
    const userLocation = [position.coords.latitude, position.coords.longitude];
    //Create map with initial view
    let map = L.map('mapid').setView(userLocation, 13);
    let tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let options = {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
    };
    L.tileLayer(tileURL, options).addTo(map);

    //Adding circle to map
    options = {
        fillColor: "#94d8ff",
        fillOpacity: 0.3,
        color: "#324ca8",
        radius: 5000
    }
    L.circle(userLocation, options).addTo(map);

    //Adding marker to map
    let userMarker = L.marker(userLocation);
    userMarker.addTo(map);
    userMarker.bindPopup("<span style='font-size:12px;font-weight:bold;'>5km from your location</span>").openPopup();
}

function failure(error) {
    console.log(`ERROR ${error.code}: ${error.message}`);
}