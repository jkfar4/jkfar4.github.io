/**
 * This code was generated from https://addressfinder.com.au/docs/getting_started/
 */
let layerGroup = undefined;

(function () {
    var widget, initAddressFinder = function () {
        widget = new AddressFinder.Widget(
            document.getElementById('addressField'),
            'WT7MBKDPJVFA43UG9RHY',
            'AU', {
            "address_metadata_params": {
                "gps": "1"
            },
            "address_params": {
                "gnaf": "1",
                "state_codes": "VIC"
            },
            "max_results": "6",
            "empty_content": "No addresses were found. This could be a new address, or you may need to check the spelling. Learn more"
        }
        );

        // On event address select (when an address is selected from the dropdown), the callback function is triggered
        widget.on('address:select', function (fullAddress, metaData) {
            document.getElementById('addressField').value = metaData.full_address
            
            // Remove any previous layers from the map. This is to avoid have multiple address layers being visible on the map. Only one at a time. 
            if (layerGroup != undefined) {
                layerGroup.clearLayers();
            }

            const addressLocation = [metaData.latitude, metaData.longitude];
            map.flyTo(addressLocation, 12);
            // Create 5KM circle
            options = {
                fillColor: "#94d8ff",
                fillOpacity: 0.3,
                color: "#324ca8",
                radius: 5000
            }
            let circle5KM = L.circle(addressLocation, options);

            // Create marker
            let userMarker = L.marker(addressLocation);
            userMarker.bindPopup("<span style='font-size:12px;font-weight:bold;'>5km from your location</span>").openPopup();

            // Add layers to map
            layerGroup = L.layerGroup([circle5KM, userMarker])
            layerGroup.addTo(map);
        });


    };

    function downloadAddressFinder() {
        var script = document.createElement('script');
        script.src = 'https://api.addressfinder.io/assets/v3/widget.js';
        script.async = true;
        script.onload = initAddressFinder;
        document.body.appendChild(script);
    };

    document.addEventListener('DOMContentLoaded', downloadAddressFinder);
})();