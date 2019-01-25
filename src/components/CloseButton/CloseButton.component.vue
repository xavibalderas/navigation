<template>
<div class="close-button">
  <button v-on:click="close">
    <font-awesome-icon icon="times-circle"/>
  </button>
</div>
</template>

<script>

export default {
  name: 'CloseButton',
  methods:{
    close: function(event){
      this.$emit('close-window');
      this.$store.commit('toggleSearch');
    }
  }//methods
}
</script>

<style lang="scss" scoped>
@import "./CloseButton.styles.scss"
</style>
