//Initially show melbourne on the map.
const melbourneLocation = [-37.840935, 144.946457];

//Create map with initial view.
let map = L.map('mapid').setView(melbourneLocation, 10)
let tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
let options = {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
};
L.tileLayer(tileURL, options).addTo(map);