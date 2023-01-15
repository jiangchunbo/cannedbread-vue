import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import VueCodemirror from 'vue-codemirror'
// import base style
import 'codemirror/lib/codemirror.css'

Vue.use(VueCodemirror)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

import VueCodeMirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
Vue.use(VueCodeMirror)

Vue.config.productionTip = false

import axios from './utils/request'
Vue.prototype.$axios = axios

import axios2 from 'axios'
Vue.prototype.$axios2 = axios2

import VideoJs from 'video.js'
import 'video.js/dist/video-js.css'

Vue.prototype.$video = VideoJs

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
