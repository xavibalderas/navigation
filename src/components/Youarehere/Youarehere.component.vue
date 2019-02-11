<template>
<div id="you-are-here" >
<a v-on:click="center"><img src="/here.png"/> {{ $t('your_are_in') }}{{getFloor()}}</a>
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Youarehere',
  computed: mapGetters([
     'getFloor',
   ]),
   methods:{
    center: function(event){
        this.$store.commit('centerMap');
    }
   }
}
</script>

<style lang="scss" scoped>
@import "./Youarehere.styles.scss"
</style>
