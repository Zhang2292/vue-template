import Vue from 'vue'

import 'normalize.css/normalize.css' 
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss'  

import App from './App'
import store from './store'
import router from './router'

import '@/icons'  
import '@/permission' 

if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.use(ElementUI)

// 注册为全局组件
import API from "@/api";
import CategorySelect from "@/components/CategorySelect";
import HintButton from "@/components/HintButton";

// 让任意组件都可以使用API相关的接口
Vue.prototype.$API = API;
Vue.component( CategorySelect.name, CategorySelect )
Vue.component( HintButton.name, HintButton )

// 注册全局组件
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
