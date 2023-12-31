// main.ts
import { createApp } from 'vue'

// APP
import App from './App.vue'
const app = createApp(App)

// PINIA
import {createPinia} from "pinia"
const pinia = createPinia()
app.use(pinia)

// ROUTER
import {router} from "./router"
app.use(router)


// TOOLTIP
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
Moment.locale('zh', {
  week: {
    dow: 1  // 全局配置 moment，设置星期的第一天为 星期一
  }
})

// Date Picker
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
app.component('Datepicker', Datepicker);

app.mount('#app')
