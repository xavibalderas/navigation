<template>
<div id="footer">
  <div class="content">
    <div class="left-content">
      <h2>{{this.selectedPlace.name}}</h2>
      <p v-if="this.selectedPlace.data !== undefined">
        <template v-if="this.selectedPlace.data.articles !== undefined" >
                {{this.selectedPlace.data.articles.join(', ')}}
                </template>
      </p>
    </div>

    <div class="right-content">
      <ul class="services">
      </ul>
    </div>

  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Footer',
  computed: mapState([
  'selectedPlace'
  ]),
}
</script>

<style lang="scss" scoped>
@import "./footer.styles.scss"
</style>
