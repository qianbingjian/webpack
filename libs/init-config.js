import configLocal from './config-local'

export default {
  async config () {
    let origin = location.origin || (location.protocol + '//' + location.host)
    const localOrigin = origin

    // 本地开发环境
    const devOrigin = location.protocol + '//' + 'dev.zqlian.com'
    const isLocalhost = /localhost|127|192|(\D:\d+)/.test(origin)
    if (isLocalhost) origin = devOrigin
    const isDev = isLocalhost || origin.indexOf('//dev') > -1
    let BASE_LRON_BONES

    if (isLocalhost) {
      if (configLocal) {
        if (configLocal.origin) origin = configLocal.origin
        BASE_LRON_BONES = configLocal.BASE_LRON_BONES
      }
    }

    const isDevOrigin = origin.indexOf('dev.zqlian.com') > -1
    window.CONFIG = {
      isDevOrigin,
      isLocalhost,
      isDev,
      BASE_LRON_BONES,
      BASE_WWW_URL: isLocalhost ? 'http://localhost:8010/#' : localOrigin + '/#',
      ...window.CONFIG
    }
    // 中间件
    // window.CONFIG.BASE_LRON_BONES = BASE_LRON_BONES || window.CONFIG.API_URL.replace(/api$/, 'lron/v2/bones')

    // 检测是否支持阿里云
    // if (window.Z.constant.isQa) {
    //   window.CONFIG.CONNECT_ALI_YUN = 'Y'
    // } else {
    //   window.Z.api.file.oss.test().then((data) => {
    //     window.CONFIG.CONNECT_ALI_YUN = 'Y'
    //   }).catch(() => {
    //     window.CONFIG.CONNECT_ALI_YUN = 'N'
    //   })
    // }
    return origin
  }
}
