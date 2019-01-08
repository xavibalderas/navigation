import Vue from 'vue'
import App from './App.vue'
import {Tabs, Tab} from 'vue-tabs-component'
import store from './store'

Vue.config.productionTip = false
Vue.component('tabs', Tabs);
Vue.component('tab', Tab);

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
