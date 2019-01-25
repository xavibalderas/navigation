import Vue from 'vue'
import App from './App.vue'
import {Tabs, Tab} from 'vue-tabs-component'
import store from './store'
import VueAnalytics from 'vue-analytics'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faMapMarkerAlt, faPlus, faMinus, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import router from './router'


library.add(faSearch, faMapMarkerAlt, faPlus, faMinus, faTimesCircle)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false
Vue.component('tabs', Tabs);
Vue.component('tab', Tab);

Vue.use(VueAnalytics, {
  id: 'UA-125590444-6'
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
