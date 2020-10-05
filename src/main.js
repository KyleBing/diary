import Vue from 'vue'
import Router from 'vue-router'
import axios from "axios";

import routes from './router';
import App from './App.vue'

Vue.config.productionTip = false

const router = new Router({
  // mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  next()

})

import utility from "./utility";

Vue.use(Router);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

Vue.config.devtools = true; // Vue Devtools Chrome 插件支持


