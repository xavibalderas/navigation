<template>
  <div>
    <Header/>
    <Map />
    <Footer />
    <Youarehere />
  </div>
</template>


<script>

import Header from '@/components/Header/header.component.vue';
import Map from '@/components/Map/map.component.vue';
import Footer from '@/components/Footer/footer.component.vue';
import Youarehere from '@/components/Youarehere/Youarehere.component.vue';



export default {
  name: 'Home',
  props: ['lang'],
  components: {
    Header,
    Map,
    Footer,
    Youarehere
  },
}
</script>
