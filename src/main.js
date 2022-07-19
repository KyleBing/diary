import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

const app = createApp(App)
app.use(store).use(router).mount('#app')




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

import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

app.component('Datepicker', Datepicker);
