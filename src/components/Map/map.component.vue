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
        const mapwizeMap = new Mapwize.Map(MapTools.initConfig, MapTools.mapConfig);
        mapwizeMap.on('mapwize:ready', () => {
            MapTools.init(mapwizeMap);
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
