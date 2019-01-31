import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import i18n from './i18n.js'
import store from './store.js'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/:lang',
      name: 'home',
      component: Home,
      props: true,
      beforeEnter (to, from, next){
        const lang = to.params.lang
        console.log(to);
        store.commit({
          type: 'setlanguage',
          l: lang
        });

        if (i18n.locale !== lang) {
          i18n.locale = lang;
        }
        return next();
      }
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ],
  mode: 'history'
})
