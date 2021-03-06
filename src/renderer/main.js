import Vue from 'vue'
import axios from 'axios'
// import {Confirm} from 'ant-design-vue';
// import { Message } from "ant-design-vue";
// import 'ant-design-vue/lib/Form/style/css'

import App from './App'
import router from './router'
import store from './store'
import './assets/assets.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
// Vue.message = Vue.prototype.$message = Message
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
