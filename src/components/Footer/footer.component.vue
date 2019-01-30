<template>
<div id="footer">
  <div class="content">
    <div class="left-content">
      <h2>{{getTranslation(this.selectedPlace._id, 'title')}}</h2>
      <template v-if="this.selectedPlace.data !== undefined">
        <template v-if="this.selectedPlace.data[language] !== undefined" >
                <ul>
                <template v-for="(place) in this.selectedPlace.data[language]">
                  <li>{{place}}</li>
                </template>
                </ul>
                </template>
      </template>
    </div>

    <div class="right-content">
      <ContainedPlaces/>

    </div>

  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';
import ContainedPlaces from '../ContainedPlaces/ContainedPlaces.component.vue';
import { mapGetters } from 'vuex'

export default {
  name: 'Footer',
  components: {
    ContainedPlaces
  },
  computed:{
  ...mapGetters([
     'getTranslation',
   ]),
   ...mapState([
   'selectedPlace', 'language'
   ])
  }
}
</script>

<style lang="scss" scoped>
@import "./footer.styles.scss"
</style>
