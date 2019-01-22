<template>
  <div id="app">
  <Header/>
  <Map />
  <Footer />
  <Youarehere />
  </div>
</template>

<script>

import Header from './components/Header/header.component.vue';
import Map from './components/Map/map.component.vue';
import Footer from './components/Footer/footer.component.vue';
import Youarehere from './components/Youarehere/Youarehere.component.vue';

export default {
  name: 'app',
  components: {
    Header,
    Map,
    Footer,
    Youarehere
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Verdana', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  height:3840px;
}
</style>
