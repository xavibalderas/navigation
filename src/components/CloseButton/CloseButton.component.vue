<template>
<div class="close-button">
  <button v-on:click="close"><i class="fas fa-times-circle"></i></button>
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
