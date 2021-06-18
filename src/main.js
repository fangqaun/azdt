import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // 全局样式文件

import App from './App' // 引入我们根组件
import store from './store' // 全局状态管理
import router from './router' // 全局路由相关

import * as directives from '@/directives' // -> { key: value, key: value }
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})

import * as filters from '@/filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 统一注册自定义插件
import Component from '@/components'
Vue.use(Component)

// directives -> { key: value, key: value }

import '@/icons' // icon
import '@/permission' // 控制页面权限相关

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
Vue.use(ElementUI)
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

import Print from 'vue-print-nb'
Vue.use(Print)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
