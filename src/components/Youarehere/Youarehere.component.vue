<template>
<div id="you-are-here">
<img src="/here.png"/> {{ $t('your_are_in') }}{{getFloor()}}
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Youarehere',
  computed: mapGetters([
     'getFloor',
   ]),
}
</script>

<style lang="scss" scoped>
@import "./Youarehere.styles.scss"
</style>
