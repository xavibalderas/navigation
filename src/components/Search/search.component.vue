<template>
<div id="search">
  <div class="content">
  <CloseButton v-on:close-window="closeSearch"/>
    <tabs>
      <tab name="Räume">
          <template v-for="(value, propertyName) in this.departments">
          <h3>Hhhds</h3>
            <ul>
              <template v-for="(v, p) in value">
                <li><a v-on:click="selectPlace(v)">{{v.name}}</a></li>
                </template>
            </ul>
          </template>
      </tab>
      <tab name="Produkte">
        <ProductList />
      </tab>
      <tab name="Facilities">
        <template v-for="(value, propertyName) in this.facilities">
        <h3>Hhhds</h3>
          <ul>
            <template v-for="(v, p) in value">
              <li><a v-on:click="selectPlace(v)">{{v.name}}</a></li>
              </template>2
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
  'departments', 'facilities'
  ]), //computed
  methods:{
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
