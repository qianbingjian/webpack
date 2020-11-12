import Vue from 'vue'
import intMixin from './int-mixin'
import initConfig from './init-config'

const initMethod = {
  initVue () {
    // 给Vue对象混入内容
    Vue.mixin(intMixin)
  }
}
export default {
  async init (Vue) {
    console.log('init')
    initMethod.initVue()

    // 初始化链接配置 window.CONFIG
    const origin = await initConfig.config()
    // 链接切换的兼容处理
    window.onhashchange = () => {
      if (window.Z.constant.vue.$router) window.Z.constant.vue.$router.push(window.location.hash.slice(1))
    }
    window.Z.global.subscribe.bind('reset-global-init-data', (useOrigin, next) => {
      initMethod.initData(useOrigin || origin).then(next)
    })

    // 缓存的初始化
    // await window.Z.global.cache.init()
    // 心跳处理
    // window.Z.service.utils.heart.start()
    return Promise.all([].map(type => {
      return initMethod[type]()
    }))
  }
}
