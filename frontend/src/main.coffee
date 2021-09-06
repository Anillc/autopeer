import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import createPersistedState from 'vuex-persistedstate';

import store from './store'
import App from './App.vue'
import Home from './views/Home.vue'

Vue.use Vuex
Vue.use VueRouter
Vue.use Vuetify

Vue.config.productionTip = false

router = new VueRouter
  mode: 'history'
  routes: [{
    path: '/'
    component: Home
  },{
    path: '/new'
    component: -> import('./views/New.vue')
  }]

router.afterEach -> document.querySelector('html').scroll 0, 0

# TODO
# router.beforeEach ->
#   if()

vuetify = new Vuetify()

vue = new Vue {
  render: (h) -> h App
  store: new Vuex.Store {
    ...store
    plugins: [createPersistedState()]
  } 
  router
  vuetify
}

vue.$mount '#app'