// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'

import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
const App = require('./App').default
const router = require('./router').default

Vue.config.productionTip = false
Vue.config.devtools = true

// element组件默认尺寸 samll
Vue.use(ElementUI, { size: 'small' })

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router: router,
  template: '<App/>',
  components: { App }
})