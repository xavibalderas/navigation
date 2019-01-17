<template>
<div id="search">
  <div class="content">
  <CloseButton v-on:close-window="closeSearch"/>
    <tabs>
      <tab name="Räume">
        <template v-for="(pL) in this.placeLists">
        <h3>{{pL.name}}</h3>
          <ul>
            <template v-for="(id) in pL.placeIds">
              <li><a <a v-on:click="selectPlace(placeById(id))">{{placeById(id).name}}</a></li>
              </template>
          </ul>
        </template>
      </tab>
      <tab name="Produkte">
        <ProductList />
      </tab>
      <tab name="Facilities">
        <template v-for="(fL) in this.facilities">
        <h3>{{fL.name}}</h3>
          <ul>
            <template v-for="(id) in fL.placeIds">
              <li><a v-on:click="selectPlace(placeById(id))">{{placeById(id).name}}</a></li>
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


export default {
  name: 'Search',
  components: {
    CloseButton,
    ProductList
  }, //components
  computed: mapState([
      'departments', 'facilities', 'placeLists', 'places'
    ]), //computed
  methods:{
    placeById(_id){
        return this.places.find(pl => pl._id===_id);
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
