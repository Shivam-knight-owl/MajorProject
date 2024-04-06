maptilersdk.config.apiKey = mapKey;

const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element to render the map
    style: maptilersdk.MapStyle.STREETS,
    center: coordinates, // starting position [lng, lat]
    zoom: 12, // starting zoom
});

const marker = new maptilersdk.Marker({color:"#fe424d"})
  .setLngLat(coordinates)
  .setPopup(new maptilersdk.Popup().setHTML("<h5>You'll be living here!</h5>"))
  .addTo(map);