<template>
<div class="ProductList">
  <div class="letter_selector">
    <ul>
    <template v-for="(value) in this.letters">
        <li> <a  v-bind:class="{ active: selectedLetter===value }" v-on:click="selectLetter(value)">{{value}}</a></li>
      </template>
    </ul>
  </div>
  <div class="products">
    <ul>
    <template v-for="(value, propertyName) in this.products">
          <li><a v-on:click="selectProduct(value)">{{value.name}}</a></li>
      </template>
    </ul>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ProductList',
  computed:{
    products: function(){
      const sLetter = this.$store.state.selectedLetter;
      return this.$store.state.products.filter(product => product.letter === sLetter);
    },
    ...mapState([
    'letters', 'selectedLetter'
  ])
  }, //computed
  methods: {
    selectProduct: function (product){
    console.log(product.placeId);
      this.$store.commit(
        {
          type: 'changePlace',
          placeId: product.placeId,
        }
      );
    },

    selectLetter: function (letter){

      this.$store.commit(
        {
          type: 'changeLetter',
          letter: letter,
        }
      );
    }
  } //methods
}
</script>

<style lang="scss" scoped>
@import "./ProductList.styles.scss"
</style>
