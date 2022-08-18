import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

const app = createApp(App)
app.use(store).use(router).mount('#app')


// tooltip
import FloatingVue from 'floating-vue'
let tooltipOptions = {
   // tooltip for bill
   arrowOverflow: true,
   themes: {
      'tooltip-bill':{ // 这是主题名，对应 bill 页面中 v-tooltip 的 theme
         placement: 'right',
         triggers: ['hover', 'focus', 'touch'],
      }
   }
}
app.use(FloatingVue, tooltipOptions)
import 'floating-vue/dist/style.css'


// 使移动端支持 :hover 样式
document.addEventListener("touchstart", function() {},false)


// MOMENT
import Moment from "moment"

// 全局配置 moment，设置星期的第一天为 星期一
Moment.locale('zh', {
   week: {
      dow: 1
   }
})


// Date Picker
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
app.component('Datepicker', Datepicker);
