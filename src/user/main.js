import 'babel-polyfill'
import '~/libs/styles/index.scss'
import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import Global from '~/libs/global'
const App = require('./App').default
const routes = require('./router').default

Vue.config.productionTip = false
Vue.config.devtools = true

// 初始化global
Vue.use(Global, {

})
// element组件默认尺寸 samll
Vue.use(ElementUI, { size: 'small' })
const router = new Router({
  routes
})
window.Z.global.subscribe.ready('window-g-ready', () => {
  console.log('window-g-ready')
  // eslint-disable-next-line no-new
  new Vue({
    el: '#app',
    router: router,
    template: '<App/>',
    components: { App }
  })
})
