<template>
<div id="search">
  <div class="content">
  <CloseButton v-on:close-window="closeSearch"/>
    <tabs :options="{ useUrlFragment: false }">
      <tab :name="$t('rooms')">
        <template v-for="(pL) in this.placeLists">
        <h3>{{pL.name}}</h3>
          <ul>
            <template v-for="(id) in pL.placeIds">
              <li><a <a v-on:click="selectPlace(placeById(id))">{{getTranslation(id,'title')}}</a></li>
              </template>
          </ul>
        </template>
      </tab>
      <tab :name="$t('products')">
        <ProductList />
      </tab>
      <tab :name="$t('facilities')">
        <template v-for="(fL) in this.facilities">
        <h3>{{fL.name}}</h3>
          <ul>
            <template v-for="(id) in fL.placeIds">
              <li><a class="link-with-icon" v-on:click="selectPlace(placeById(id))"><img width="75px" class="facility-icon" v-bind:src=placeById(id).style.markerUrl /> - {{placeById(id).name}}</a></li>
              </template>
          </ul>
        </template>
      </tab>
    </tabs>
  </div>
</div>
</template>

<script>

import CloseButton from '../CloseButton/CloseButton.component.vue';
import ProductList from '../ProductList/ProductList.component.vue';
import { mapState } from 'vuex';
import { mapGetters } from 'vuex'



export default {
  name: 'Search',
  components: {
    CloseButton,
    ProductList
  }, //components
  computed: {
  ...mapGetters([
     'getTranslation',
     'getPlaceById'
   ]),
   ...mapState([
       'departments', 'facilities', 'placeLists', 'places'
     ])
  }, //computed
  methods:{
    placeById(_id){
        const _p = this.places.find(pl => pl._id===_id);
        return _p;
    },
    closeSearch: function(event){
      console.log("hola");
    },
    selectPlace: function(place){
    this.$ga.event({
        eventCategory: 'search',
        eventAction: 'Place selected',
        eventLabel: 'place',
        eventValue: 123
      })
      this.$store.commit({
        type: 'changePlace',
        place: place
      });
      this.$store.commit('toggleSearch');
    }
  }//methods
}
</script>

<style lang="scss">
@import "./search.styles.scss"
</style>
