import Vue from 'vue'
import App from './App.vue'
import {Tabs, Tab} from 'vue-tabs-component'
import store from './store'
import VueAnalytics from 'vue-analytics'



Vue.config.productionTip = false
Vue.component('tabs', Tabs);
Vue.component('tab', Tab);

Vue.use(VueAnalytics, {
  id: 'UA-125590444-6'
})

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
