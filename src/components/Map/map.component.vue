<template>
<div id="map">
  <div id="mapContainer"></div>
  <Search v-show="showSearch"/>
  <div id="controls">
    <div id="search-control">
      <button v-on:click="searchButton()">
        <font-awesome-icon icon="search"/>
      </button>
    </div>
    <div id="zoomin-control">
      <button v-on:click="zoomIn()">
        <font-awesome-icon icon="plus"/>
      </button>
    </div>
    <div id="zoomout-control">
      <button v-on:click="zoomOut()">
        <font-awesome-icon icon="minus"/>
      </button>
    </div>
  </div>
</div>
</template>

<script>

import Search from '../Search/search.component.vue';
import MapTools from '../../tools/map.tools.js';
import { mapState } from 'vuex';

export default {
  name: 'Map',

  components: {
    Search,
  },
  computed: mapState([
  'showSearch', 'bearing', 'lat', 'lng', 'language', 'floor'
  ]),
  methods: {
    zoomIn: function() {
      MapTools.zoomIn();
    },
    zoomOut: function() {
      MapTools.zoomOut();
    },
    searchButton: function (event){
      this.$store.commit('toggleSearch');
    }
  },
  mounted: function () {


        //Mapwize.apiKey('3d2dafbf53a14c95cee47c2348f9c5c3');
        console.log(MapTools);
        MapTools.initMap({bearing: this.bearing}, {preferredLanguage: this.language},
          {
          latitude: this.lat, //47.42209953906886,
          longitude: this.lng, //8.375177110719962,
          floor: this.floor, //1,
          bearing: this.bearing, //48.1,
          language: this.language //'en'
          }
        )

      //  const mapwizeMap = new Mapwize.Map({
      //  bearing: this.bearing,
      //  ...MapTools.initConfig}, {preferredLanguage: this.language, ...MapTools.mapConfig});
      //  mapwizeMap.on('mapwize:ready', () => {
      //      MapTools.init(mapwizeMap, {
      //        latitude: this.lat, //47.42209953906886,
      //        longitude: this.lng, //8.375177110719962,
      //        floor: this.floor, //1,
      //        bearing: this.bearing, //48.1,
      //        language: this.language //'en'
      //      });
      //      MapTools.initInfo(mapwizeMap);
      //      MapTools.addControls();
      //  });
      //  mapwizeMap.on('mapwize:loaderror', err => {
      //    // Something bad happened during Mapwize loading
      //    console.error(err);
      //  });
  }
}

</script>

<style lang="scss" scoped>
@import "./map.styles.scss"
</style>
