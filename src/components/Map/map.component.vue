<template>
<div id="map">
  <div id="mapContainer"></div>
</div>
</template>

<script>
var Mapwize = require('mapwize');
//import Mapwize from 'mapwize';

export default {
  name: 'Map',
  mounted: function () {
    Mapwize.apiKey('3d2dafbf53a14c95cee47c2348f9c5c3')
         const mapwizeMap = new Mapwize.Map({
             container: 'mapContainer',
             center: [8.375177110719962, 47.42209953906886],
             zoom: 7,
             bearing: 48.1,
             userPosition: true,
             navigationControl: false,
             maxBounds: [ [8.374355309642853, 47.42066766240786], [8.377269508782776, 47.4226107356658] ], // Need to be LngLatBoundsLike: https://www.mapbox.com/mapbox-gl-js/api/#lnglatboundslike
             }, {
             venueId: '5b8ffe23051cd90021bd526f'
         });;

         mapwizeMap.on('mapwize:ready', () => {
          // Mapwize map is now ready to be used
          mapwizeMap.setFloor(1);
          mapwizeMap.setUserPosition({
      latitude: 47.42209953906886,
      longitude: 8.375177110719962,
      floor: 1,
      accuracy: 8
    });

          mapwizeMap.setLayoutProperty('mapwize_places_symbol','text-size',18);
          mapwizeMap.setLayoutProperty('position','icon-size',1);
          mapwizeMap.setLayoutProperty('mapwize_places_symbol','icon-size',0.4);
          mapwizeMap.setLayoutProperty('mapwize_places_symbol','text-offset',[0,0.4]);
          mapwizeMap.setLayoutProperty('mapwize_places_symbol','text-optional',false);
          mapwizeMap.setLayoutProperty('mapwize_places_symbol','text-anchor','center');
          mapwizeMap.setLayoutProperty('mapwize_places_symbol','text-anchor','top');

          mapwizeMap.setPaintProperty("mapwize_places_fill", 'fill-color', '#FFFFFF');
          mapwizeMap.setPaintProperty("mapwize_places_fill", 'fill-opacity', 0);
          mapwizeMap.setPaintProperty("mapwize_directions_dash", 'line-color', '#FAD23C');

          });
          mapwizeMap.on('mapwize:loaderror', err => {
            // Something bad happened during Mapwize loading
            console.error(err);
          });
  }
}

</script>

<style lang="scss" scoped>
@import "./map.styles.scss"
</style>
