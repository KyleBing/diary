import Vue from 'vue'
import Router from 'vue-router'

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


// Network request
import qs from 'qs'
import axios from 'axios'
// 设置 axios，把请求数据在这里转换一下，参考官方文档： https://github.com/axios/axios
axios.defaults.transformRequest = [(data, header) => {
  return qs.stringify(data);
}]

Vue.prototype.$axios = axios
Vue.prototype.$URL = utility.URL


