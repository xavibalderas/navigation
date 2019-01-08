<template>
<div id="footer">
  <div class="content">
    <div class="left-content">
      <h2>{{this.selectedPlace.name}}</h2>
      <p v-if="this.selectedPlace.data !== undefined">
                {{this.selectedPlace.data.articles.join(', ')}}
      </p>
    </div>

    <div class="right-content">
      <ul class="services">
        <li>hdhd</li>
        <li>hdhd</li>
        <li>hdhd</li>
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
