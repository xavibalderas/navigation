<template>
<div id="in-places">
  <template v-for="(place) in containedPlaces">
    <template v-if="checkIfExists(place._id)">
      <img width="75px" class="facility-icon" v-bind:src=place.style.markerUrl /> - {{place.name}} <br/>
    </template>
  </template>
</div>
</template>

<script>
import { mapState } from 'vuex';


export default {
  name: 'ContainedPlaces',
  computed: mapState([
  'containedPlaces', 'facilities'
  ]),
  methods: {
    checkIfExists(_id){
        const _a = this.facilities[0].placeIds;
        const _p = _a.indexOf(_id);
        return _p !== -1;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./ContainedPlaces.styles.scss"
</style>
