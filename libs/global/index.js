import * as auth from './auth'
import * as subscribe from './subscribe'
import * as utils from './utils'
import init from '~/libs/init'
import serviceUtils from '~/libs/service/utils'
import api from '~/libs/api'

export default {
  install (Vue, options = {}) {
    const baseGlobal = (window.Z || {}).global
    // 全局属性
    const G = {
      ...options,
      auth,
      utils,
      subscribe,
      ...baseGlobal
    }
    window.Z = {
      api,
      global: G,
      Extends: {},
      service: {
        utils: {
          ...serviceUtils
        }
      },
      constant: {
        ...options
      },
      ...window.Z,
      ...options
    }

    // 全局时间 可用于图片刷新
    window.Z.constant.timestap = Date.now()
    Vue.prototype.Z = window.Z
    // 系统环境初始化
    init.init(Vue).then(async () => {
      // 不需要初始化数据
      // if (!window.Z.constant.disabledInit) {
      //   common.init(G)
      // }
      // window.Z.global.base.setPlatformTitle()
      window.Z.global.subscribe.ready('window-g-ready')
    })
  }
}
