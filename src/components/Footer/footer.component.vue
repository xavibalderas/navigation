<template>
<div id="footer">
  <div class="content">
    <div class="left-content">
      <h2>{{getTranslation(this.selectedPlace._id, 'title')}}</h2>
      <p v-if="this.selectedPlace.data !== undefined">
        <template v-if="this.selectedPlace.data[language] !== undefined" >
                {{this.selectedPlace.data[language].join(', ')}}
                </template>
      </p>
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
