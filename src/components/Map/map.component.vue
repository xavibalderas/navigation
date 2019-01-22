<template>
<div id="map">
  <div id="mapContainer"></div>
  <Search v-show="showSearch"/>
</div>
</template>

<script>
var Mapwize = require('mapwize');
import Search from '../Search/search.component.vue';
import MapTools from '../../tools/map.tools.js';
import { mapState } from 'vuex';

export default {
  name: 'Map',

  components: {
    Search,
  },
  computed: mapState([
  'showSearch'
  ]),
  mounted: function () {

        Mapwize.apiKey('3d2dafbf53a14c95cee47c2348f9c5c3');
        
        const mapwizeMap = new Mapwize.Map({
        bearing:48.1,
        ...MapTools.initConfig}, MapTools.mapConfig);
        mapwizeMap.on('mapwize:ready', () => {
            MapTools.init(mapwizeMap, {
              latitude: 47.42209953906886,
              longitude: 8.375177110719962,
              floor: 1,
              bearing: 48.1
            });
            MapTools.initInfo(mapwizeMap);
            MapTools.addControls();
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
